const { db } = require("../../utils/database");

exports.tagModel = (req, res, next) => {
  req.body.tags.forEach((tag) =>
    db
      .doc(`/tags/${tag}`)
      .get()
      .then((doc) =>
        !doc.exists
          ? db.doc(`/tags/${tag}`).set({
              tag,
            })
          : null
      )
      .catch((err) => next(new Error(err)))
  );
  next();
};
