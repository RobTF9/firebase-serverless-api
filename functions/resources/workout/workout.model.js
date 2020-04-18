const { validateWorkout } = require("../../utils/validators");

exports.newWorkoutModel = (req, res, next) => {
  const { title, createdBy, excercises, tags, description } = req.body;

  const slug =
    title
      .replace(/[^a-z0-9_]+/gi, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase() +
    "-" +
    createdBy;

  const newWorkout = {
    title,
    createdBy,
    slug,
    createdAt: new Date().toISOString(),
    excercises,
    tags,
    description,
    likes: 0,
    logs: 0,
    comments: 0,
  };

  const { valid, errors } = validateWorkout(newWorkout);

  !valid ? res.status(400).json(errors) : (req.body = newWorkout);
  next();
};
