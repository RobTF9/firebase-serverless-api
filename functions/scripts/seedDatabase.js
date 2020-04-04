const { db } = require("../utils/admin");
const {
  WORKOUTS_COLLECTION,
  USERS_COLLECTION,
  TAGS_COLLECTION,
  MUSCLES_COLLECTION,
  NOTIFICATIONS_COLLECTION,
  LIKES_COLLECTION,
  COMMENTS_COLLECTION
} = require("../routes/constants");

const {
  workouts,
  users,
  tags,
  muscles,
  notifications,
  likes,
  comments
} = require("../seed.json");

comments.forEach(comment => {
  const { username, createdAt, userImage, workoutId, body } = comment;

  const newComment = {
    username,
    createdAt,
    userImage,
    workoutId,
    body
  };
  db.doc(`${COMMENTS_COLLECTION}/${comment.id}`)
    .set(newComment)
    .then(() => {
      console.log(`Comment ${comment.id} document written.`);
    })
    .catch(error => {
      console.error(error);
    });
});

likes.forEach(like => {
  const { username, workoutId } = like;

  const newLike = {
    username,
    workoutId
  };
  db.doc(`${LIKES_COLLECTION}/${like.id}`)
    .set(newLike)
    .then(() => {
      console.log(`Like ${like.id} document written.`);
    })
    .catch(error => {
      console.error(error);
    });
});

notifications.forEach(notification => {
  const { type, read, recipient, createdAt, sender, workoutId } = notification;

  const newNotification = {
    type,
    read,
    recipient,
    createdAt,
    sender,
    workoutId
  };
  db.doc(`${NOTIFICATIONS_COLLECTION}/${notification.id}`)
    .set(newNotification)
    .then(() => {
      console.log(`Notification ${notification.id} document written.`);
    })
    .catch(error => {
      console.error(error);
    });
});

muscles.forEach(muscle => {
  db.doc(`${MUSCLES_COLLECTION}/${muscle}`)
    .set({
      muscle
    })
    .then(() => {
      console.log(`Muscle ${muscle} document written.`);
    })
    .catch(error => {
      console.error(error);
    });
});

tags.forEach(tag => {
  db.doc(`${TAGS_COLLECTION}/${tag}`)
    .set({
      tag
    })
    .then(() => {
      console.log(`Tag ${tag} document written.`);
    })
    .catch(error => {
      console.error(error);
    });
});

users.forEach(user => {
  db.doc(`${USERS_COLLECTION}/${user.username}`)
    .set(user)
    .then(() => {
      console.log(`User ${user.username} document written.`);
    })
    .catch(error => {
      console.error(error);
    });
});

workouts.forEach(workout => {
  const {
    username,
    userImage,
    description,
    likes,
    comments,
    tags,
    createdAt,
    title,
    logs,
    muscles,
    excercises,
    slug
  } = workout;

  const newWorkout = {
    username,
    userImage,
    description,
    likes,
    comments,
    tags,
    createdAt,
    title,
    logs,
    muscles,
    excercises,
    slug
  };
  db.doc(`${WORKOUTS_COLLECTION}/${workout.id}`)
    .set(newWorkout)
    .then(() => {
      console.log(`Workout ${workout.title} document written.`);
    })
    .catch(error => {
      console.error(error);
    });
});
