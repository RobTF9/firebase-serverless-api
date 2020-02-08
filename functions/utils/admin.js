const admin = require("firebase-admin");
const firebaseConfig = require("./config");
const functions = require("firebase-functions");
const serviceAccount =
  functions.config().app.environment === "dev"
    ? require("../credentials/development-credentials.json")
    : require("../credentials/production-credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://workout-app-8d732.firebaseio.com",
  firebaseConfig
});

// Create database ref
const db = admin.firestore();

module.exports = { admin, db };
