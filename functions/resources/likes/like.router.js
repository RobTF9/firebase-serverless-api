const likeRouter = require("express").Router();
const {
  createOne,
  removeOne,
  getByUser,
  getByWorkout,
} = require("./like.controllers");

// /api/likes
likeRouter.route("/").get(getByUser);

likeRouter.route("/:id").get(getByWorkout).post(createOne).delete(removeOne);

module.exports = likeRouter;
