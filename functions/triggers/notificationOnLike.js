const functions = require("firebase-functions");
const { db } = require("../utils/database");

module.exports = functions
  .region("europe-west1")
  .firestore.document(`/likes/{id}`)
  .onCreate((snapshot) => {
    return db
      .doc(`/workouts/${snapshot.data().workoutId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().username !== snapshot.data().username) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().createdBy,
            sender: snapshot.data().username,
            type: "like",
            read: false,
            workoutId: doc.id,
          });
        } else {
          return null;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
