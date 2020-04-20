const workoutSchema = {
  title: (value) =>
    typeof value === "string" && value.trim() !== "" ? true : false,
  createdBy: (value) =>
    typeof value === "string" && value.trim() !== "" ? true : false,
  createdAt: (value) =>
    typeof value === "string" && value.trim() !== "" ? true : false,
  description: (value) =>
    typeof value === "string" && value.trim() !== "" ? true : false,
  excercises: (value) =>
    Array.isArray(value) && value.length > 0 ? true : false,
  tags: (value) => (Array.isArray(value) ? true : false),
  likes: (value) => (typeof value === "number" ? true : false),
  logs: (value) => (typeof value === "number" ? true : false),
  comments: (value) => (typeof value === "number" ? true : false),
};

const excerciseSchema = {
  title: (value) =>
    typeof value === "string" && value.trim() !== "" ? true : false,
  sets: (value) => (typeof value === "number" ? true : false),
  reps: (value) => (typeof value === "number" ? true : false),
  rest: (value) => (typeof value === "number" ? true : false),
  double: (value) => (typeof value === "boolean" ? true : false),
  timed: (value) => (typeof value === "boolean" ? true : false),
};

exports.workoutModel = (req, res, next) => {
  const workout = {
    title: req.body.title,
    createdBy: req.body.createdBy ? req.body.createdBy : req.user.username,
    createdAt: req.body.createdAt
      ? req.body.createdAt
      : new Date().toISOString(),
    excercises: req.body.excercises,
    tags: req.body.tags,
    description: req.body.description,
    likes: req.body.likes ? req.body.likes : 0,
    logs: req.body.logs ? req.body.logs : 0,
    comments: req.body.comments ? req.body.comments : 0,
  };

  let errors = {};

  Object.keys(workoutSchema)
    .filter((key) => !workoutSchema[key](workout[key]))
    .forEach((key) => {
      errors[key] = ` Workout key: ${key} is invalid`;
    });

  workout.excercises.forEach((excercise, index) => {
    Object.keys(excerciseSchema)
      .filter((key) => !excerciseSchema[key](excercise[key]))
      .forEach((key) => {
        errors[
          key + "-" + index
        ] = ` Excercise at array[${index}] key: ${key} is invalid`;
      });
  });

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  req.body = workout;
  return next();
};
