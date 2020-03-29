const functions = require("firebase-functions");
const { db } = require("../utils/admin");
const { WORKOUTS_COLLECTION, MUSCLES_ROUTE } = require("../routes/constants");

module.exports = functions
  .region("europe-west1")
  .firestore.document(`${WORKOUTS_COLLECTION}/{id}`)
  .onCreate(snapshot => {
    return snapshot.data().muscles.forEach(muscle => {
      db.doc(`${MUSCLES_ROUTE}/${muscle}`)
        .get()
        .then(doc => {
          if (!doc.exists) {
            return db.doc(`${MUSCLES_ROUTE}/${muscle}`).set({
              muscle
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
