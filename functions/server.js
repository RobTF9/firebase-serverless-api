const firebase = require("firebase");
const firebaseConfig = require("./utils/config");
const cors = require("cors");
const workoutRouter = require("./resources/workouts/workout.router");
const likeRouter = require("./resources/likes/like.router");
const tagRouter = require("./resources/tags/tag.router");
const commentRouter = require("./resources/comments/comment.router");
const { signin, signup, protect } = require("./utils/auth");
const app = require("express")();

firebase.initializeApp(firebaseConfig);
app.use(cors({ origin: true }));

app.post("/signin", signin);
app.post("/signup", signup);

app.use("/workouts", protect, workoutRouter);
app.use("/likes", protect, likeRouter);
app.use("/tags", protect, tagRouter);
app.use("/comments", protect, commentRouter);

app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    res.json(err.message);
  } else {
    console.log(res);
    res.end();
  }
});

module.exports = app;
