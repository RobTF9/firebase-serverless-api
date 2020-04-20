const { db } = require("../utils/admin");
const { NOTIFICATIONS_COLLECTION } = require("../routes/constants");

db.collection(NOTIFICATIONS_COLLECTION)
  .get()
  .then(data => {
    let notifications = [];
    data.forEach(notification => {
      notifications.push({
        id: notification.id,
        ...notification.data()
      });
    });
    console.log(JSON.stringify(notifications));
  })
  .catch(error => {
    console.error(error);
  });
