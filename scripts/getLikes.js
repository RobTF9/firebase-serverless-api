const { db } = require("../functions/utils/admin");
const { LIKES_COLLECTION } = require("../routes/constants");

db.collection(LIKES_COLLECTION)
  .get()
  .then((data) => {
    let likes = [];
    data.forEach((like) => {
      likes.push({
        id: like.id,
        ...like.data(),
      });
    });
    console.log(JSON.stringify(likes));
  })
  .catch((error) => {
    console.error(error);
  });
