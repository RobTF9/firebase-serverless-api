const { db } = require("../../utils/admin");
const { WORKOUTS_ROUTE, COMMENTS_COLLECTION } = require("../constants");

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
