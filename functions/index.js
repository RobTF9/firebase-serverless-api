const functions = require("firebase-functions");

const { db } = require("./utils/admin");

const {
  WORKOUTS_ROUTE,
  WORKOUT_ROUTE,
  SIGNUP_ROUTE,
  LOGIN_ROUTE,
  USER_IMAGE_ROUTE,
  USER_ROUTE,
  LIKES_COLLECTION,
  NOTIFICATIONS_ROUTE,
  COMMENTS_COLLECTION
} = require("./routes/constants");

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
  getUserDetails,
  getAnyUserDetails
} = require("./routes/users");

const FBAuth = require("./utils/fbAuth");

// Initialize express
const app = require("express")();

// Workout routes
app.get(WORKOUTS_ROUTE, getAllWorkouts);
app.post(WORKOUT_ROUTE, FBAuth, createNewWorkout);
app.get(`${WORKOUT_ROUTE}/:workoutId`, getWorkout);
app.delete(`${WORKOUT_ROUTE}/:workoutId`, FBAuth, deleteWorkout);
app.get(`${WORKOUT_ROUTE}/:workoutId/like`, FBAuth, likeWorkout);
app.get(`${WORKOUT_ROUTE}/:workoutId/unlike`, FBAuth, unLikeWorkout);
app.post(`${WORKOUT_ROUTE}/:workoutId/comment`, FBAuth, commentOnWorkout);

// User routes
app.post(SIGNUP_ROUTE, signUp);
app.post(LOGIN_ROUTE, logIn);
app.post(USER_IMAGE_ROUTE, FBAuth, uploadProfileImage);
app.post(USER_ROUTE, FBAuth, addUserDetails);
app.get(USER_ROUTE, FBAuth, getUserDetails);
app.get(`${USER_ROUTE}/:handle`, getAnyUserDetails);

// Export express router on /api
exports.api = functions.region("europe-west1").https.onRequest(app);

// Notification triggers
exports.createNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document(`${LIKES_COLLECTION}/{id}`)
  .onCreate(snapshot => {
    db.doc(`${WORKOUTS_ROUTE}/${snapshot.data().workoutId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`${NOTIFICATIONS_ROUTE}/${snapshot.id}`).set({
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
  .firestore.document(`${LIKES_COLLECTION}/{id}`)
  .onDelete(snapshot => {
    db.doc(`${NOTIFICATIONS_ROUTE}/${snapshot.id}`)
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
  .firestore.document(`${COMMENTS_COLLECTION}/{id}`)
  .onCreate(snapshot => {
    db.doc(`${WORKOUTS_ROUTE}/${snapshot.data().workoutId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`${NOTIFICATIONS_ROUTE}/${snapshot.id}`).set({
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
