const { db } = require("../utils/admin");

const {
  WORKOUTS_COLLECTION,
  WORKOUTS_ROUTE,
  COMMENTS_COLLECTION,
  LIKES_COLLECTION,
  LIKES_ROUTE
} = require("./constants");

const { createSlug } = require("../utils/helpers");
const { validateWorkout } = require("../utils/validators");

exports.getAllWorkouts = (request, response) => {
  db.collection(WORKOUTS_COLLECTION)
    .orderBy("createdAt", "desc")
    .get()
    // Loop over data and push it into array
    .then(data => {
      let workouts = [];
      data.forEach(workout => {
        workouts.push({
          workoutId: workout.id,
          ...workout.data()
        });
      });
      // Return array as json
      return response.json(workouts);
    })
    // Returns a promise so catch error
    .catch(error => console.error(error));
};

exports.createNewWorkout = (request, response) => {
  // Deconstruct values off body object.
  const { title, countdown, excercises } = request.body;

  // The new workout object to be added to the database.
  const workout = {
    title,
    username: request.user.username,
    countdown,
    // Create slug function takes username and title and forces them into lowercase no spaces string.
    slug: createSlug(title, request.user.username),
    createdAt: new Date().toISOString(),
    userImage: request.user.imageUrl,
    excercises,
    likes: 0,
    comments: 0
  };

  const { valid, errors } = validateWorkout(workout);

  if (!valid) return response.status(400).json(errors);

  db.collection(WORKOUTS_COLLECTION)
    .add(workout)
    .then(doc => {
      const responseWorkout = workout;
      responseWorkout.workoutId = doc.id;
      response.json(responseWorkout);
    })
    .catch(error => {
      response.status(500).json({ error: "There was a server error." });
      console.error(error);
    });
};

exports.getWorkout = (request, response) => {
  let workoutData = {};
  db.doc(`${WORKOUTS_ROUTE}/${request.params.workoutId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return response.json(404).json({ error: "Workout not found!" });
      }
      workoutData = doc.data();
      workoutData.workoutId = doc.id;
      return db
        .collection(COMMENTS_COLLECTION)
        .orderBy("createdAt", "desc")
        .where("workoutId", "==", request.params.workoutId)
        .get();
    })
    .then(data => {
      workoutData.comments = [];
      data.forEach(doc => {
        workoutData.comments.push(doc.data());
      });
      return response.json(workoutData);
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({ error: error.code });
    });
};

exports.commentOnWorkout = (request, response) => {
  if (request.body.body.trim() === "")
    return response.json(400).json({ comment: "Must not be empty" });

  const newComment = {
    body: request.body.body,
    createdAt: new Date().toISOString(),
    workoutId: request.params.workoutId,
    username: request.user.username,
    userImage: request.user.imageUrl
  };

  db.doc(`${WORKOUTS_ROUTE}/${request.params.workoutId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Workout not found!" });
      }
      return doc.ref.update({ comments: doc.data().comments + 1 });
    })
    .then(() => {
      return db.collection(COMMENTS_COLLECTION).add(newComment);
    })
    .then(() => {
      response.json(newComment);
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({ error: error.code });
    });
};

exports.likeWorkout = (request, response) => {
  const likeDoc = db
    .collection(LIKES_COLLECTION)
    .where("username", "==", request.user.username)
    .where("workoutId", "==", request.params.workoutId)
    .limit(1);

  const workoutDoc = db.doc(`${WORKOUTS_ROUTE}/${request.params.workoutId}`);

  let workoutData;

  workoutDoc
    .get()
    .then(doc => {
      if (doc.exists) {
        workoutData = doc.data();
        workoutData.workoutId = doc.id;
        return likeDoc.get();
      } else {
        return response.status(404).json({ error: "Workout not found" });
      }
    })
    .then(data => {
      if (data.empty) {
        return db
          .collection(LIKES_COLLECTION)
          .add({
            workoutId: request.params.workoutId,
            username: request.user.username
          })
          .then(() => {
            workoutData.likes++;
            return workoutDoc.update({ likes: workoutData.likes });
          })
          .then(() => {
            response.json(workoutData);
          });
      } else {
        return response.status(400).json({ error: "Workout already liked!" });
      }
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({ error: error.code });
    });
};

exports.unLikeWorkout = (request, response) => {
  const likeDoc = db
    .collection(LIKES_COLLECTION)
    .where("username", "==", request.user.username)
    .where("workoutId", "==", request.params.workoutId)
    .limit(1);

  const workoutDoc = db.doc(`${WORKOUTS_ROUTE}/${request.params.workoutId}`);

  let workoutData;

  workoutDoc
    .get()
    .then(doc => {
      if (doc.exists) {
        workoutData = doc.data();
        workoutData.workoutId = doc.id;
        return likeDoc.get();
      } else {
        return response.status(404).json({ error: "Workout not found" });
      }
    })
    .then(data => {
      if (data.empty) {
        return response
          .status(400)
          .json({ error: "Workout not already liked!" });
      } else {
        return db
          .doc(`${LIKES_ROUTE}/${data.docs[0].id}`)
          .delete()
          .then(() => {
            workoutData.likes--;
            return workoutDoc.update({ likes: workoutData.likes });
          })
          .then(() => {
            response.json(workoutData);
          });
      }
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({ error: error.code });
    });
};

exports.deleteWorkout = (request, response) => {
  const workout = db.doc(`${WORKOUTS_ROUTE}/${request.params.workoutId}`);

  workout
    .get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Workout not found!" });
      }
      if (doc.data().username !== request.user.username) {
        return response
          .status(403)
          .json({ error: "You can't delete another users workout!" });
      } else {
        return workout.delete();
      }
    })
    .then(() => {
      response.json({ message: "Workout succesfully deleted" });
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({ error: error.code });
    });
};
