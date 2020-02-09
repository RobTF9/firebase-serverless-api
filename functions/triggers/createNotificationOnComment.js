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
    db.doc(`${WORKOUTS_ROUTE}/${snapshot.data().workoutId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`${NOTIFICATIONS_ROUTE}/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().username,
            sender: snapshot.data().username,
            type: "comment",
            read: false,
            workoutId: doc.id
          });
        }
      })
      .then(() => {
        // Don't need to send a response as this is just a trigger not an API endpoint.
        return;
      })
      .catch(error => {
        console.error(error);
        return;
      });
  });
