const { db } = require("../../utils/admin");
const { WORKOUTS_ROUTE, COMMENTS_COLLECTION } = require("../constants");

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
