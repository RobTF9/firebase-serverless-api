const { db, notifications } = require("../../utils/database");

exports.getMany = (req, res, next) =>
  notifications
    .where("recipient", "==", req.user.username)
    .get()
    .then((data) => {
      let array = [];
      data.forEach((notification) => {
        array.push({
          notification: notification.id,
          ...notification.data(),
        });
      });
      res.status(200).json({ data: array });
    })
    .catch((err) => next(new Error(err)));

exports.updateOne = (req, res, next) =>
  db
    .doc(`/notifications/${req.params.id}`)
    .update({ read: true })
    .then(() =>
      res.status(200).json({
        message: "Notification marked read",
      })
    )
    .catch((err) => next(new Error(err)));

exports.updateMany = (req, res, next) => {
  if (!Array.isArray(req.body) || req.body.length === 0) {
    res.status(400).json({ message: "No notifcation array" });
  }

  let batch = db.batch();

  req.body.forEach((id) =>
    batch.update(db.doc(`/notifications/${id}`), { read: true })
  );

  batch
    .commit()
    .then(() => res.status(200).json({ message: "Notifications marked read" }))
    .catch((err) => next(new Error(err)));
};
