const { db } = require("../../utils/admin");
const { WORKOUTS_ROUTE, LIKES_COLLECTION } = require("../constants");

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
