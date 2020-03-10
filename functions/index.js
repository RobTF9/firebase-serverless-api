const functions = require("firebase-functions");
const firebase = require("firebase");
const firebaseConfig = require("./utils/config");

const {
  WORKOUTS_ROUTE,
  WORKOUT_ROUTE,
  SIGNUP_ROUTE,
  LOGIN_ROUTE,
  USER_IMAGE_ROUTE,
  USER_ROUTE,
  USERS_ROUTE,
  NOTIFICATIONS_ROUTE
} = require("./routes/constants");

const { getAllWorkouts } = require("./routes/workouts/getAllWorkouts");
const { createNewWorkout } = require("./routes/workouts/createNewWorkout");
const { getWorkout } = require("./routes/workouts/getWorkout");
const { editWorkout } = require("./routes/workouts/editWorkout");
const { commentOnWorkout } = require("./routes/workouts/commentOnWorkout");
const { likeWorkout } = require("./routes/workouts/likeWorkout");
const { unLikeWorkout } = require("./routes/workouts/unLikeWorkout");
const { deleteWorkout } = require("./routes/workouts/deleteWorkout");
const { signUp } = require("./routes/users/signUp");
const { logIn } = require("./routes/users/logIn");
const { addUserDetails } = require("./routes/users/addUserDetails");
const { getUserDetails } = require("./routes/users/getUserDetails");
const { uploadProfileImage } = require("./routes/users/uploadProfileImage");
const { getAnyUserDetails } = require("./routes/users/getAnyUserDetails");
const {
  markNotificationsRead
} = require("./routes/users/markNotificationsRead");
const { copyWorkout } = require("./routes/workouts/copyWorkout");

const FBAuth = require("./utils/fbAuth");

// Initialize express
const app = require("express")();

const cors = require("cors");
app.use(cors());

firebase.initializeApp(firebaseConfig);

// Workout routes
app.get(WORKOUTS_ROUTE, getAllWorkouts);
app.post(WORKOUT_ROUTE, FBAuth, createNewWorkout);
app.get(`${WORKOUT_ROUTE}/:workoutId`, getWorkout);
app.post(`${WORKOUT_ROUTE}/:workoutId`, FBAuth, editWorkout);
app.delete(`${WORKOUT_ROUTE}/:workoutId`, FBAuth, deleteWorkout);
app.get(`${WORKOUT_ROUTE}/:workoutId/like`, FBAuth, likeWorkout);
app.get(`${WORKOUT_ROUTE}/:workoutId/unlike`, FBAuth, unLikeWorkout);
app.post(`${WORKOUT_ROUTE}/:workoutId/comment`, FBAuth, commentOnWorkout);
app.post(`${WORKOUT_ROUTE}/:workoutId`, FBAuth, editWorkout);
app.post(`${WORKOUT_ROUTE}/:workoutId/copy`, FBAuth, copyWorkout);
// TODO add image to workout and excercise

// User routes
app.post(SIGNUP_ROUTE, signUp);
app.post(LOGIN_ROUTE, logIn);
app.post(USER_IMAGE_ROUTE, FBAuth, uploadProfileImage);
app.post(USER_ROUTE, FBAuth, addUserDetails);
app.get(USER_ROUTE, FBAuth, getUserDetails);
app.get(`${USERS_ROUTE}/:username`, getAnyUserDetails);
app.post(NOTIFICATIONS_ROUTE, FBAuth, markNotificationsRead);

// Export express router on /api
exports.api = functions.region("europe-west1").https.onRequest(app);

// Notification triggers
exports.createNotificationOnLike = require("./triggers/createNotificationOnLike");
exports.deleteNotificationOnUnlike = require("./triggers/deleteNotificationOnUnlike");
exports.createNotificationOnComment = require("./triggers/createNotificationOnComment");
exports.onUserImageChange = require("./triggers/onUserImageChange");
exports.deleteWorkoutCleanup = require("./triggers/deleteWorkoutCleanup");
