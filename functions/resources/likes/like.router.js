const likeRouter = require("express").Router();
const { createOne } = require("./like.controllers");

// /api/likes

likeRouter.route("/:id").post(createOne);

module.exports = likeRouter;
