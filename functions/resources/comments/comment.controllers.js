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
