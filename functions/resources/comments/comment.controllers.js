const { db, comments } = require("../../utils/database.js");

exports.createOne = (req, res, next) =>
  db
    .doc(`/workouts/${req.params.id}`)
    .get()
    .then((doc) =>
      !doc.exists
        ? res.status(404).json({ error: "Workout not found" })
        : doc.ref.update({ comments: doc.data().comments + 1 })
    )
    .then(() => comments.add(req.body))
    .then(() => res.status(200).json(req.body))
    .catch((err) => next(new Error(err)));

exports.getByUser = (req, res, next) =>
  comments
    .where("createdBy", "==", req.user.username)
    .get()
    .then((data) => {
      let array = [];
      data.forEach((comment) => {
        array.push({
          id: comment.id,
          ...comment.data(),
        });
      });
      res.status(200).json({ data: array });
    })
    .catch((err) => next(new Error(err)));

exports.getByWorkout = (req, res, next) =>
  comments
    .where("workoutId", "==", req.params.id)
    .get()
    .then((data) => {
      let array = [];
      data.forEach((comment) => {
        array.push({
          id: comment.id,
          ...comment.data(),
        });
      });
      res.status(200).json({ data: array });
    })
    .catch((err) => next(new Error(err)));
