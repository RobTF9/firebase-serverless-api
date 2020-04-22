const excerciseSchema = {
  content: (value) =>
    typeof value === "string" && value.trim() !== "" ? true : false,
  createdAt: (value) =>
    typeof value === "string" && value.trim() !== "" ? true : false,
  createdBy: (value) =>
    typeof value === "string" && value.trim() !== "" ? true : false,
  workoutId: (value) =>
    typeof value === "string" && value.trim() !== "" ? true : false,
};

exports.commentModel = (req, res, next) => {
  const comment = {
    content: req.body.comment,
    createdAt: new Date().toISOString(),
    createdBy: req.user.username,
    workoutId: req.params.id,
  };

  let errors = {};

  Object.keys(excerciseSchema)
    .filter((key) => !excerciseSchema[key](comment[key]))
    .forEach((key) => {
      errors[key] = ` Comment key: ${key} is invalid`;
    });

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  req.body = comment;
  return next();
};
