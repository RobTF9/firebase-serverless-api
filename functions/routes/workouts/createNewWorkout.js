const { db } = require("../../utils/admin");
const { WORKOUTS_COLLECTION } = require("../constants");
const { createSlug } = require("../../utils/helpers");
const { validateWorkout } = require("../../utils/validators");

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
