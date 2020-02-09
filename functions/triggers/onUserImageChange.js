const functions = require("firebase-functions");
const { db } = require("../utils/admin");
const {
  USERS_ROUTE,
  WORKOUTS_COLLECTION,
  WORKOUTS_ROUTE
} = require("../routes/constants");

module.exports = functions
  .region("europe-west1")
  .firestore.document(`${USERS_ROUTE}/{userId}`)
  .onUpdate(change => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      let batch = db.batch();
      return db
        .collection(WORKOUTS_COLLECTION)
        .where("username", "==", change.before.data().username)
        .get()
        .then(data => {
          data.forEach(doc => {
            const workout = db.doc(`${WORKOUTS_ROUTE}/${doc.id}`);
            batch.update(workout, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else {
      return true;
    }
  });
