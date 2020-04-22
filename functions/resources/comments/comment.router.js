const commentRouter = require("express").Router();
const { createOne, getByUser, getByWorkout } = require("./comment.controllers");
const { commentModel } = require("./comment.model");

// /api/likes
commentRouter.route("/").get(getByUser);

commentRouter.route("/:id").get(getByWorkout).post(commentModel, createOne);

module.exports = commentRouter;
