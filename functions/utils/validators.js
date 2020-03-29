const { isEmpty, isEmail, isEmptyArray } = require("../utils/helpers");

exports.validateSignUpDetails = details => {
  // Initialize errors object
  let errors = {};

  // Validate email
  if (isEmpty(details.email)) {
    errors.email = "Must not be empty.";
  } else if (!isEmail(details.email)) {
    errors.email = "Must be a valid email address.";
  }

  // Validate password
  if (isEmpty(details.password)) errors.password = "Must not be empty.";
  if (details.password !== details.confirmPassword)
    errors.confirmPassword = "Passwords must match.";

  // Validate username
  if (isEmpty(details.username)) errors.username = "Must not be empty.";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginDetails = details => {
  let errors = {};

  // Validate email address
  if (isEmpty(details.email)) errors.email = "Must not me empty.";

  // Validate password
  if (isEmpty(details.password)) errors.password = "Must not me empty.";

  // Check if errors exsist
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateWorkout = workout => {
  // Initialize errors object
  let errors = {};

  // Validate title
  if (isEmpty(workout.title)) errors.title = "Must not be empty.";

  // Validate title
  if (isEmpty(workout.description)) errors.description = "Must not be empty.";

  // Validate excercises
  if (isEmptyArray(workout.excercises))
    errors.excercise = "Workout must have at least one excercise.";

  // Validate tags
  if (isEmptyArray(workout.tags))
    errors.tags = "You must select a least one tag.";

  // Validate muscles
  if (isEmptyArray(workout.muscles))
    errors.muscles = "You must select a least one tag.";

  const excerciseSchema = {
    title: value =>
      typeof value === "string" && value.trim() !== "" ? true : false,
    sets: value => (typeof value === "number" ? true : false),
    reps: value => (typeof value === "number" ? true : false),
    rest: value => (typeof value === "number" ? true : false),
    double: value => (typeof value === "boolean" ? true : false),
    timed: value => (typeof value === "boolean" ? true : false)
  };

  let excerciseErrors = [];

  const validateExcercise = (object, schema, index) => {
    // Create an array of errors by filtering an mapping over the keys of the past over object.
    let errors = Object.keys(schema)
      .filter(key => !schema[key](object[key]))
      .map(key => new Error(`Excercise ${index + 1} ${key} is invalid.`));

    if (errors.length > 0) {
      errors.forEach(function(error) {
        excerciseErrors.push(error.message);
      });
    }
  };

  // Iterate through the excercises and run the validate function on them.
  workout.excercises.forEach((excercise, index) => {
    validateExcercise(excercise, excerciseSchema, index);
  });

  // If the excerciseErrors array is not empty then add it to the errors object.
  if (!isEmptyArray(excerciseErrors)) errors.excercises = excerciseErrors;

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
