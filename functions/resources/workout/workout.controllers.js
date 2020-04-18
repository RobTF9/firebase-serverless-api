const { db, workouts } = require("../../utils/database");

exports.getOne = (req, res) =>
  db
    .doc(`/workouts/${req.params.id}`)
    .get()
    .then((doc) =>
      !doc.exists
        ? res.status(404).end()
        : res.status(200).json({ ...doc.data(), id: doc.id })
    )
    .catch((err) => console.error(err));

exports.getMany = (req, res) =>
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
      res.status(200).json(array);
    })
    .catch((err) => console.error(err));

exports.createOne = (req, res) =>
  workouts
    .add(req.body)
    .then(({ id }) => res.status(200).json({ id, ...req.body }))
    .catch((err) => console.error(err));

const updateOne = (model) => (req, res) => {};

const removeOne = (model) => (req, res) => {};
