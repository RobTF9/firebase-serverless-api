const { db } = require("../utils/admin");
const { COMMENTS_COLLECTION } = require("../routes/constants");

db.collection(COMMENTS_COLLECTION)
  .get()
  .then(data => {
    let comments = [];
    data.forEach(comment => {
      comments.push({
        id: comment.id,
        ...comment.data()
      });
    });
    console.log(JSON.stringify(comments));
  })
  .catch(error => {
    console.error(error);
  });
