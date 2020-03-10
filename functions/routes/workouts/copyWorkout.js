const { db } = require("../../utils/admin");
const { WORKOUTS_ROUTE, WORKOUTS_COLLECTION } = require("../constants");
const { createSlug } = require("../../utils/helpers");

exports.copyWorkout = (request, response) => {
  let workoutData = {};
  db.doc(`${WORKOUTS_ROUTE}/${request.params.workoutId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return response.json(404).json({ error: "Workout not found!" });
      }
      workoutData = doc.data();
      return workoutData;
    })
    .then(data => {
      const workout = {
        title: data.title,
        username: request.user.username,
        countdown: data.countdown,
        slug: createSlug(data.title, request.user.username),
        createdAt: new Date().toISOString(),
        userImage: request.user.imageUrl,
        excercises: data.excercises,
        likes: 0,
        type: data.type,
        comments: 0
      };
      return workout;
    })
    .then(workout => {
      db.collection(WORKOUTS_COLLECTION).add(workout);
      return response.json(workout);
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({ error: error.code });
    });
};
