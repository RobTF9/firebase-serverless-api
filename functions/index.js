const functions = require("firebase-functions");
const { db } = require("./utils/admin");
const {
  getAllWorkouts,
  createNewWorkout,
  getWorkout,
  commentOnWorkout,
  likeWorkout,
  unLikeWorkout,
  deleteWorkout
} = require("./routes/workouts");
const {
  signUp,
  logIn,
  uploadProfileImage,
  addUserDetails,
  getUserDetails
} = require("./routes/users");
const FBAuth = require("./utils/fbAuth");

// Initialize express
const app = require("express")();

// Workout routes
app.get("/workouts", getAllWorkouts);
app.post("/workout", FBAuth, createNewWorkout);
app.get(`/workout/:workoutId`, getWorkout);
app.delete(`/workout/:workoutId`, FBAuth, deleteWorkout);
app.get(`/workout/:workoutId/like`, FBAuth, likeWorkout);
app.get(`/workout/:workoutId/unlike`, FBAuth, unLikeWorkout);
app.post(`/workout/:workoutId/comment`, FBAuth, commentOnWorkout);

// User routes
app.post("/signup", signUp);
app.post("/login", logIn);
app.post("/user/image", FBAuth, uploadProfileImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getUserDetails);

// Export express router on /api
exports.api = functions.region("europe-west1").https.onRequest(app);

// Notification triggers
exports.createNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document(`likes/{id}`)
  .onCreate(snapshot => {
    db.doc(`workouts/${snapshot.data().workoutId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().username,
            sender: snapshot.data().username,
            type: "like",
            read: false,
            workoutId: doc.id
          });
        }
      })
      .then(() => {
        // Don't need to send a response as this is just a trigger not an API endpoint.
        return;
      })
      .catch(error => {
        console.error(error);
        return;
      });
  });

exports.deleteNotificationOnUnlike = functions
  .region("europe-west1")
  .firestore.document(`likes/{id}`)
  .onDelete(snapshot => {
    db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        // Don't need to send a response as this is just a trigger not an API endpoint.
        return;
      })
      .catch(error => {
        console.error(error);
        return;
      });
  });

exports.createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document(`comments"/{id}`)
  .onCreate(snapshot => {
    db.doc(`/workouts/${snapshot.data().workoutId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().username,
            sender: snapshot.data().username,
            type: "comment",
            read: false,
            workoutId: doc.id
          });
        }
      })
      .then(() => {
        // Don't need to send a response as this is just a trigger not an API endpoint.
        return;
      })
      .catch(error => {
        console.error(error);
        return;
      });
  });
