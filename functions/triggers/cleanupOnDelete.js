const functions = require("firebase-functions");
const { db, comments, likes, notifications } = require("../utils/database");

module.exports = functions
  .region("europe-west1")
  .firestore.document(`/workouts/{workoutId}`)
  .onDelete((snapshot, context) => {
    const workoutId = context.params.workoutId;
    const batch = db.batch();
    return comments
      .where("workoutId", "==", workoutId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return likes.where("workoutId", "==", workoutId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return notifications.where("workoutId", "==", workoutId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
