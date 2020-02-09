const functions = require("firebase-functions");
const { db } = require("../utils/admin");
const {
  WORKOUTS_ROUTE,
  LIKES_COLLECTION,
  NOTIFICATIONS_ROUTE
} = require("../routes/constants");

module.exports = functions
  .region("europe-west1")
  .firestore.document(`${LIKES_COLLECTION}/{id}`)
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
            type: "like",
            read: false,
            workoutId: doc.id
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  });
