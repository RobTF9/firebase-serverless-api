const functions = require("firebase-functions");
const { db } = require("../utils/admin");
const {
  LIKES_COLLECTION,
  NOTIFICATIONS_ROUTE
} = require("../routes/constants");

module.exports = functions
  .region("europe-west1")
  .firestore.document(`${LIKES_COLLECTION}/{id}`)
  .onDelete(snapshot => {
    return db
      .doc(`${NOTIFICATIONS_ROUTE}/${snapshot.id}`)
      .delete()
      .catch(error => {
        console.error(error);
      });
  });
