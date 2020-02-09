const { db } = require("../../utils/admin");
const { USERS_ROUTE } = require("../constants");
const { reduceUserDetails } = require("../../utils/helpers");

exports.addUserDetails = (request, response) => {
  let userDetails = reduceUserDetails(request.body);

  db.doc(`${USERS_ROUTE}/${request.user.username}`)
    .update(userDetails)
    .then(() => {
      return response.json({ message: "Details added successfully" });
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};
