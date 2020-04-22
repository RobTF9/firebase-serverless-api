const functions = require("firebase-functions");
const { db } = require("../utils/database");

module.exports = functions
  .region("europe-west1")
  .firestore.document(`/likes/{id}`)
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
      });
  });
