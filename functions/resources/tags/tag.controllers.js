const { tags } = require("../../utils/database");

exports.getMany = (req, res, next) =>
  tags
    .get()
    .then((data) => {
      let array = [];
      data.forEach((tag) => {
        array.push({
          ...tag.data(),
        });
      });
      res.status(200).json({ data: array });
    })
    .catch((err) => next(new Error(err)));
