const { db, likes } = require("../../utils/database");

exports.createOne = (req, res, next) => {
  let workout;
  likes
    .where("username", "==", req.user.username)
    .where("workoutId", "==", req.params.id)
    .limit(1)
    .get()
    .then((data) =>
      !data.empty ? res.status(400).json("Error: Workout already liked") : data
    )
    .then(() => db.doc(`/workouts/${req.params.id}`).get())
    .then((doc) =>
      !doc.exists
        ? res.status(404).json("Error: Workout not found")
        : (workout = {
            ...doc.data(),
            id: doc.id,
          })
    )
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
    .then(() =>
      res.status(200).json({ message: "Workout liked", data: { ...workout } })
    )
    .catch((err) => next(new Error(err)));
};

exports.removeOne = (req, res, next) => {
  let like, workout;
  likes
    .where("username", "==", req.user.username)
    .where("workoutId", "==", req.params.id)
    .limit(1)
    .get()
    .then((data) => {
      if (!data.empty) {
        like = data.docs[0];
        return like;
      } else {
        return res.status(400).json("Error: Workout not already liked");
      }
    })
    .then(() => db.doc(`/workouts/${req.params.id}`).get())
    .then((doc) =>
      doc.exists
        ? (workout = {
            ...doc.data(),
            id: doc.id,
          })
        : res.status(404).json("Error: Workout not found")
    )
    .then(() => db.doc(`/likes/${like.id}`).delete())
    .then(() => {
      workout.likes--;
      return db
        .doc(`/workouts/${req.params.id}`)
        .update({ likes: workout.likes });
    })
    .then(() =>
      res.status(200).json({ message: "Workout unliked", data: { ...workout } })
    )
    .catch((err) => next(new Error(err)));
};
