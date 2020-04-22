const functions = require("firebase-functions");
const app = require("./server");

exports.api = functions.region("europe-west1").https.onRequest(app);

exports.cleanupOnDelete = require("./triggers/cleanupOnDelete");
exports.notificationOnLike = require("./triggers/notificationOnLike");
exports.notificationOnComment = require("./triggers/notificationOnComment");
