const functions = require("firebase-functions");
const app = require("./server");

exports.api = functions.region("europe-west1").https.onRequest(app);
