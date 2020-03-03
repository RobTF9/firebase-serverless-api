const { db } = require("../../utils/admin");
const { WORKOUTS_ROUTE } = require("../constants");
const { validateWorkout } = require("../../utils/validators");

exports.editWorkout = (request, response) => {
  const { valid, errors } = validateWorkout(request.body);
  if (!valid) return response.status(400).json(errors);

  if (request.user.username !== request.body.username)
    return response.status(400).json({ user: "This is not your workout." });

  db.doc(`${WORKOUTS_ROUTE}/${request.body.workoutId}`)
    .update(request.body)
    .then(() => {
      return response.json({ message: "Workout updated." });
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};
