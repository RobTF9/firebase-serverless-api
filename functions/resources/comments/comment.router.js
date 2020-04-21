const commentRouter = require("express").Router();
const { createOne } = require("./comment.controllers");
const { commentModel } = require("./comment.model");

// /api/likes

commentRouter.route("/:id").post(commentModel, createOne);

module.exports = commentRouter;
