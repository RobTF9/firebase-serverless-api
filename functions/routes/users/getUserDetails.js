const { db } = require("../../utils/admin");
const {
  USERS_ROUTE,
  NOTIFICATIONS_COLLECTION,
  LIKES_COLLECTION
} = require("../constants");

exports.getUserDetails = (request, response) => {
  let userData = {};
  db.doc(`${USERS_ROUTE}/${request.user.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection(LIKES_COLLECTION)
          .where("username", "==", request.user.username)
          .get();
      }
    })
    .then(data => {
      userData.likes = [];
      data.forEach(doc => {
        userData.likes.push(doc.data());
      });
      return db
        .collection(NOTIFICATIONS_COLLECTION)
        .where("recipient", "==", request.user.username)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then(data => {
      userData.notifications = [];
      data.forEach(doc => {
        userData.notifications.push({
          createdAt: doc.data().createdAt,
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          type: doc.data().type,
          read: doc.data().read,
          workoutId: doc.data().workoutId,
          notificationId: doc.id
        });
      });
      return response.json(userData);
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};
