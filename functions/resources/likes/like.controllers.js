const { db, likes } = require("../../utils/database");

exports.createOne = (req, res, next) => {
  likes
    .where("username", "==", req.user.username)
    .where("workoutId", "==", req.params.id)
    .limit(1)
    .get()
    .then((data) =>
      !data.empty ? res.status(400).json("Error: Workout already liked") : data
    )
    .catch((err) => next(new Error(err)));

  let workout;

  db.doc(`/workouts/${req.params.id}`)
    .get()
    .then((doc) => {
      if (!doc.exists) return res.status(404).json("Error: Workout not found");
      workout = doc.data();
      workout.id = doc.id;
    })
    .then(() =>
      likes.add({
        workoutId: req.params.id,
        username: req.user.username,
      })
    )
    .then(() => {
      workout.likes++;
      return db
        .doc(`/workouts/${req.params.id}`)
        .update({ likes: workout.likes });
    })
    .then(() => res.status(200).json(workout))
    .catch((err) => next(new Error(err)));
};
