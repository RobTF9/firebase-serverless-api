const { db, workouts } = require("../../utils/database");

exports.getOne = (req, res) =>
  db
    .doc(`/workouts/${req.params.id}`)
    .get()
    .then((doc) =>
      !doc.exists
        ? res.status(404).end()
        : res.status(200).json({ data: { id: doc.id, ...doc.data() } })
    )
    .catch((err) => next(new Error(err)));

exports.getMany = (req, res, next) =>
  workouts
    .get()
    .then((data) => {
      let array = [];
      data.forEach((workout) => {
        array.push({
          id: workout.id,
          ...workout.data(),
        });
      });
      res.status(200).json({ data: array });
    })
    .catch((err) => next(new Error(err)));

exports.createOne = (req, res, next) =>
  workouts
    .add(req.body)
    .then(({ id }) => res.status(200).json({ data: { id, ...req.body } }))
    .catch((err) => next(new Error(err)));

exports.updateOne = (req, res, next) =>
  db
    .doc(`/workouts/${req.params.id}`)
    .update(req.body)
    .then(() =>
      res.status(200).json({
        message: "Workout updated",
        data: { id: req.params.id, ...req.body },
      })
    )
    .catch((err) => next(new Error(err)));

exports.removeOne = (req, res, next) =>
  db
    .doc(`/workouts/${req.params.id}`)
    .get()
    .then((doc) =>
      !doc.exists
        ? res.status(404).json("Error: Workout does not exsist")
        : doc.data().createdBy !== req.user.username
        ? res.status(400).json("Error: You can't delete this workout")
        : db.doc(`/workouts/${req.params.id}`).delete()
    )
    .then(() => res.status(200).json({ message: "Workout deleted" }))
    .catch((err) => next(new Error(err)));
