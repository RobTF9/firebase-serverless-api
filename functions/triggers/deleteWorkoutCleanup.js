const functions = require("firebase-functions");
const { db } = require("../utils/admin");
const {
  WORKOUTS_ROUTE,
  COMMENTS_COLLECTION,
  COMMENTS_ROUTE,
  LIKES_COLLECTION,
  LIKES_ROUTE,
  NOTIFICATIONS_COLLECTION,
  NOTIFICATIONS_ROUTE
} = require("../routes/constants");

module.exports = functions
  .region("europe-west1")
  .firestore.document(`${WORKOUTS_ROUTE}/{workoutId}`)
  .onDelete((snapshot, context) => {
    const workoutId = context.params.workoutId;
    const batch = db.batch();
    return db
      .collection(COMMENTS_COLLECTION)
      .where("workoutId", "==", workoutId)
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`${COMMENTS_ROUTE}/${doc.id}`));
        });
        return db
          .collection(LIKES_COLLECTION)
          .where("workoutId", "==", workoutId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`${LIKES_ROUTE}/${doc.id}`));
        });
        return db
          .collection(NOTIFICATIONS_COLLECTION)
          .where("workoutId", "==", workoutId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`${NOTIFICATIONS_ROUTE}/${doc.id}`));
        });
        return batch.commit();
      })
      .catch(error => console.error(error));
  });
