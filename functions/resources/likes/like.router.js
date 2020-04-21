const likeRouter = require("express").Router();
const { createOne, removeOne, getMany } = require("./like.controllers");

// /api/likes
likeRouter.route("/").get(getMany);

likeRouter.route("/:id").post(createOne).delete(removeOne);

module.exports = likeRouter;
