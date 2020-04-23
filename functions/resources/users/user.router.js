const userRouter = require("express").Router();
const {
  updateOne,
  getOwn,
  getOther,
  uploadImage,
} = require("./user.controllers");
const { userProfileModel } = require("./user.model");

// /api/users
userRouter
  .route("/")
  .put(userProfileModel, updateOne)
  .get(getOwn)
  .post(uploadImage);

userRouter.route("/:id").get(getOther);

module.exports = userRouter;
