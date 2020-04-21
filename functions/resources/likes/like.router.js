const likeRouter = require("express").Router();
const { createOne, removeOne } = require("./like.controllers");

// /api/likes

likeRouter.route("/:id").post(createOne).delete(removeOne);

module.exports = likeRouter;
