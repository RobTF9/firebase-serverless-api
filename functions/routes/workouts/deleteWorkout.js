const { db } = require("../../utils/admin");

const { WORKOUTS_ROUTE } = require("../constants");

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
