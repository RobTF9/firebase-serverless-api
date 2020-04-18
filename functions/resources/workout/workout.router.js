const workoutRouter = require("express").Router();
const {
  getMany,
  getOne,
  createOne,
  updateOne,
  removeOne,
} = require("./workout.controllers");
const { newWorkoutModel, updateWorkoutModel } = require("./workout.model");

// /api/workouts

workoutRouter.route("/").get(getMany).post(newWorkoutModel, createOne);

workoutRouter
  .route("/:id")
  .get(getOne)
  .put(updateWorkoutModel, updateOne)
  .delete(removeOne);

module.exports = workoutRouter;
