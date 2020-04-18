const functions = require("firebase-functions");
const { db } = require("../utils/database");

module.exports = functions
  .region("europe-west1")
  .firestore.document(`/workouts/{id}`)
  .onUpdate((change) =>
    change.after.data().tags.forEach((tag) =>
      db
        .doc(`/tags/${tag}`)
        .get()
        .then((doc) =>
          !doc.exists
            ? db.doc(`/tags/${tag}`).set({
                tag,
              })
            : null
        )
        .catch((err) => console.error(err))
    )
  );
