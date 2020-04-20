const workoutRouter = require("express").Router();
const {
  getMany,
  getOne,
  createOne,
  updateOne,
  removeOne,
} = require("./workout.controllers");
const { workoutModel } = require("./workout.model");

// /api/workouts

workoutRouter.route("/").get(getMany).post(workoutModel, createOne);

workoutRouter
  .route("/:id")
  .get(getOne)
  .put(workoutModel, updateOne)
  .delete(removeOne);

module.exports = workoutRouter;
