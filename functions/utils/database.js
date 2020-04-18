const admin = require("./admin");

// Create database ref
const db = admin.firestore();
const workouts = db.collection("workouts");
const comments = db.collection("comments");
const users = db.collection("users");
const likes = db.collection("likes");
const notifications = db.collection("notifications");

module.exports = {
  db,
  workouts,
  comments,
  users,
  likes,
  notifications,
};
