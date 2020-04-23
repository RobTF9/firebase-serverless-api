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

// need a profile schema

exports.userProfileModel = (req, res, next) => {
  if (Object.keys(req.body).length !== 3)
    return res.status(400).json("Error: Invalid profile object");

  let profile = {};
  if (req.body.bio.trim() !== "") profile.bio = req.body.bio;
  if (req.body.website.trim() !== "") {
    req.body.website.trim().substring(0, 4) !== "http"
      ? (profile.website = `http://${req.body.website.trim()}`)
      : (profile.website = req.body.website);
  }
  if (req.body.location.trim() !== "") profile.location = req.body.location;

  req.body = profile;
  return next();
};
