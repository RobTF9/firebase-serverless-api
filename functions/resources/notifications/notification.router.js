const commentRouter = require("express").Router();
const {
  createOne,
  getByUser,
  getByWorkout,
} = require("./notification.controllers");
const { commentModel } = require("./notification.model");

// /api/likes
commentRouter.route("/").get(getByUser);

commentRouter.route("/:id").get(getByWorkout).post(commentModel, createOne);

module.exports = commentRouter;
