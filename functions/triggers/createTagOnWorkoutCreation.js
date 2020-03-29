const functions = require("firebase-functions");
const { db } = require("../utils/admin");
const { WORKOUTS_COLLECTION, TAGS_ROUTE } = require("../routes/constants");

module.exports = functions
  .region("europe-west1")
  .firestore.document(`${WORKOUTS_COLLECTION}/{id}`)
  .onCreate(snapshot => {
    return snapshot.data().tags.forEach(tag => {
      db.doc(`${TAGS_ROUTE}/${tag}`)
        .get()
        .then(doc => {
          if (!doc.exists) {
            return db.doc(`${TAGS_ROUTE}/${tag}`).set({
              tag
            });
          } else {
            return null;
          }
        })
        .catch(error => {
          console.error(error);
        });
    });
  });
