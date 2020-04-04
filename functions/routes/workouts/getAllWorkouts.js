const { db } = require("../../utils/admin");
const { WORKOUTS_COLLECTION } = require("../constants");

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
