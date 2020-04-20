const { db } = require("../functions/utils/database");

const {
  workouts,
  users,
  tags,
  notifications,
  likes,
  comments,
} = require("../seed.json");

comments.forEach((comment) => {
  db.doc(`/comments/${comment.id}`)
    .set(comment)
    .then(() => {
      console.log(`Comment ${comment.id} document written.`);
    })
    .catch((error) => {
      console.error(error);
    });
});

likes.forEach((like) => {
  db.doc(`/likes/${like.id}`)
    .set(like)
    .then(() => {
      console.log(`Like ${like.id} document written.`);
    })
    .catch((error) => {
      console.error(error);
    });
});

notifications.forEach((notification) => {
  db.doc(`/notifications/${notification.id}`)
    .set(notification)
    .then(() => {
      console.log(`Notification ${notification.id} document written.`);
    })
    .catch((error) => {
      console.error(error);
    });
});

tags.forEach((tag) => {
  db.doc(`/tags/${tag}`)
    .set({ tag })
    .then(() => {
      console.log(`Tag ${tag} document written.`);
    })
    .catch((error) => {
      console.error(error);
    });
});

users.forEach((user) => {
  db.doc(`/users/${user.username}`)
    .set(user)
    .then(() => {
      console.log(`User ${user.id} document written.`);
    })
    .catch((error) => {
      console.error(error);
    });
});

workouts.forEach((workout) => {
  db.doc(`/workouts/${workout.id}`)
    .set(workout)
    .then(() => {
      console.log(`Workout ${workout.id} document written.`);
    })
    .catch((error) => {
      console.error(error);
    });
});
