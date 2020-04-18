const config = require("../../utils/config");
const { db } = require("../../utils/database");

exports.newUserModel = (email, username, id) => {
  const user = {
    username,
    email,
    createdAt: new Date().toISOString(),
    imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/no-image.png?alt=media`,
    id,
  };
  return db.doc(`/users/${username}`).set(user);
};
