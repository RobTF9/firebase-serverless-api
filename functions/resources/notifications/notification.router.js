const notificationRouter = require("express").Router();
const {
  getMany,
  updateOne,
  updateMany,
} = require("./notification.controllers");

// /api/notifications
notificationRouter.route("/").get(getMany).put(updateMany);

notificationRouter.route("/:id").put(updateOne);

module.exports = notificationRouter;
