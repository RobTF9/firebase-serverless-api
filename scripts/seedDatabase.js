const { db } = require("../functions/utils/database");

const {
  workouts,
  users,
  tags,
  notifications,
  likes,
  comments,
} = require("../seed.json");

comments.forEach(({ id, workoutId, content, createdBy, createdAt }) => {
  db.doc(`/comments/${id}`)
    .set({
      content,
      workoutId,
      createdBy,
      createdAt,
    })
    .then(() => {
      console.log(`Comment ${id} document written.`);
    })
    .catch((error) => {
      console.error(error);
    });
});

likes.forEach(({ id, workoutId, username }) => {
  db.doc(`/likes/${id}`)
    .set({
      workoutId,
      username,
    })
    .then(() => {
      console.log(`Like ${id} document written.`);
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

workouts.forEach(
  ({
    id,
    createdBy,
    description,
    likes,
    logs,
    comments,
    tags,
    createdAt,
    title,
    excercises,
  }) => {
    db.doc(`/workouts/${id}`)
      .set({
        createdBy,
        description,
        likes,
        logs,
        comments,
        tags,
        createdAt,
        title,
        excercises,
      })
      .then(() => {
        console.log(`Workout ${id} document written.`);
      })
      .catch((error) => {
        console.error(error);
      });
  }
);
