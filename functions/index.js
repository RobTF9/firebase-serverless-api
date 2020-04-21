const functions = require("firebase-functions");
const app = require("./server");

exports.api = functions.region("europe-west1").https.onRequest(app);

// exports.tagOnWorkoutCreate = require("./triggers/tagOnWorkoutCreate");
// exports.tagOnWorkoutUpdate = require("./triggers/tagOnWorkoutUpdate");
exports.cleanupOnDelete = require("./triggers/cleanupOnDelete");
exports.notificationOnLike = require("./triggers/notifcationOnLike");
