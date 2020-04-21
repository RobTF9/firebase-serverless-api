const tagRouter = require("express").Router();
const { getMany } = require("./tag.controllers");

// /api/likes
tagRouter.route("/").get(getMany);

module.exports = tagRouter;
