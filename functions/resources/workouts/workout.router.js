const workoutRouter = require("express").Router();
const {
  getMany,
  getOne,
  createOne,
  updateOne,
  removeOne,
  copyOne,
} = require("./workout.controllers");
const { workoutModel } = require("./workout.model");
const { tagModel } = require("../tags/tag.model");

// /api/workouts

workoutRouter.route("/").get(getMany).post(workoutModel, tagModel, createOne);

workoutRouter
  .route("/:id")
  .get(getOne)
  .post(copyOne)
  .put(workoutModel, tagModel, updateOne)
  .delete(removeOne);

module.exports = workoutRouter;
