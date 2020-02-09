const { db } = require("../../utils/admin");
const { NOTIFICATIONS_ROUTE } = require("../constants");

exports.markNotificationsRead = (request, response) => {
  let batch = db.batch();
  request.body.forEach(notificationId => {
    const notification = db.doc(`${NOTIFICATIONS_ROUTE}/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return response.json({ message: "Notifications marked read" });
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};
