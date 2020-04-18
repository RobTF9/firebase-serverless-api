const functions = require("firebase-functions");
const { db, comments, likes, notifications } = require("../utils/database");

module.exports = functions
  .region("europe-west1")
  .firestore.document(`/workouts/{id}`)
  .onDelete((snapshot, context) =>
    comments
      .where("workoutId", "==", context.params.id)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          db.batch().delete(db.doc(`/comments/${doc.id}`));
        });
        return likes.where("workoutId", "==", context.params.id).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          db.batch().delete(db.doc(`/likes/${doc.id}`));
        });
        return notifications.where("workoutId", "==", context.params.id).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          db.batch().delete(db.doc(`/notifications/${doc.id}`));
        });
        return db.batch().commit();
      })
      .catch((err) => console.error(err))
  );
