const { db } = require("../../utils/admin");
const { WORKOUTS_COLLECTION } = require("../constants");
const { createSlug, randomImage } = require("../../utils/helpers");
const { validateWorkout } = require("../../utils/validators");
const unsplash = require("../../credentials/unsplash");

exports.createNewWorkout = (request, response) => {
  // Deconstruct values off body object.
  const { title, countdown, excercises, type, description } = request.body;

  // The new workout object to be added to the database.
  const workout = {
    title,
    username: request.user.username,
    countdown,
    // Create slug function takes username and title and forces them into lowercase no spaces string.
    slug: createSlug(title, request.user.username),
    createdAt: new Date().toISOString(),
    userImage: request.user.imageUrl,
    // image: randomImage(),
    excercises,
    type,
    description,
    likes: 0,
    logs: 0,
    comments: 0
  };

  const { valid, errors } = validateWorkout(workout);

  if (!valid) return response.status(400).json(errors);

  fetch("https://api.unsplash.com/photos/random?collections=9687580", {
    headers: {
      Authorization: `Client-ID ${unsplash}`
    }
  })
    .then(resp => resp.json()) // Transform the data into json
    .then(data => {
      workout.image = data.urls.small;
      return workout;
    })
    .then(db.collection(WORKOUTS_COLLECTION).add(workout))
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
