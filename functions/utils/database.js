const admin = require("./admin");

// Create database ref
const db = admin.firestore();
const workouts = db.collection("workouts");
const comments = db.collection("comments");
const users = db.collection("users");

module.exports = {
  db,
  workouts,
  comments,
  users,
};
