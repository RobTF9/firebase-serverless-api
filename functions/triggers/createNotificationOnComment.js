const functions = require("firebase-functions");
const { db } = require("../utils/admin");
const {
  WORKOUTS_ROUTE,
  NOTIFICATIONS_ROUTE,
  COMMENTS_COLLECTION
} = require("../routes/constants");

module.exports = functions
  .region("europe-west1")
  .firestore.document(`${COMMENTS_COLLECTION}/{id}`)
  .onCreate(snapshot => {
    return db
      .doc(`${WORKOUTS_ROUTE}/${snapshot.data().workoutId}`)
      .get()
      .then(doc => {
        if (doc.exists && doc.data().username !== snapshot.data().username) {
          return db.doc(`${NOTIFICATIONS_ROUTE}/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().username,
            sender: snapshot.data().username,
            type: "comment",
            read: false,
            workoutId: doc.id
          });
        } else {
          return null;
        }
      })
      .catch(error => {
        console.error(error);
      });
  });
