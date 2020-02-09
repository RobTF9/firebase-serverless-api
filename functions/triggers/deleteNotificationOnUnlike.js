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
    db.doc(`${NOTIFICATIONS_ROUTE}/${snapshot.id}`)
      .delete()
      .then(() => {
        // Don't need to send a response as this is just a trigger not an API endpoint.
        return;
      })
      .catch(error => {
        console.error(error);
        return;
      });
  });
