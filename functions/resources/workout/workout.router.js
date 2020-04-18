const workoutRouter = require("express").Router();
const { getMany, getOne, createOne } = require("./workout.controllers");
const { newWorkoutModel } = require("./workout.model");

// /api/workouts

workoutRouter.route("/").get(getMany).post(newWorkoutModel, createOne);

workoutRouter.route("/:id").get(getOne);

module.exports = workoutRouter;
