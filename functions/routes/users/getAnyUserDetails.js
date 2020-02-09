const { db } = require("../../utils/admin");
const { WORKOUTS_COLLECTION, USERS_ROUTE } = require("../constants");

exports.getAnyUserDetails = (request, response) => {
  let userData = {};
  db.doc(`${USERS_ROUTE}/${request.params.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.user = doc.data();
        return db
          .collection(WORKOUTS_COLLECTION)
          .where("username", "==", request.params.username)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        return response.status(404).json({ error: "User not found" });
      }
    })
    .then(data => {
      userData.workouts = [];
      data.forEach(doc => {
        userData.workouts.push({
          title: doc.data().title,
          createdAt: doc.data().createdAt,
          username: doc.data().username,
          userImage: doc.data().userImage,
          likes: doc.data().likes,
          comments: doc.data().comments,
          workoutId: doc.id
        });
      });
      return response.json(userData);
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};
