const functions = require("firebase-functions");
const { db } = require("../utils/database");
const {
  notificationModel,
} = require("../resources/notifications/notification.model");

module.exports = functions
  .region("europe-west1")
  .firestore.document(`/likes/{id}`)
  .onCreate((snapshot) => {
    return db
      .doc(`/workouts/${snapshot.data().workoutId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().username !== snapshot.data().username) {
          return db
            .doc(`/notifications/${snapshot.id}`)
            .set(
              notificationModel(
                doc.data().createdBy,
                snapshot.data().username,
                "like",
                doc.id
              )
            );
        } else {
          return null;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
