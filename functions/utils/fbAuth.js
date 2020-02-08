const { admin, db } = require("./admin");
const { USERS_COLLECTION } = require("../routes/constants");

module.exports = (request, response, next) => {
  // Initialize token
  let idToken;

  // Check user is logged in by seeing if authorization header exsists
  if (
    request.headers.authorization &&
    // Convention for tokens to start with "Bearer "
    request.headers.authorization.startsWith("Bearer ")
  ) {
    // Set ID Token to the token without "Bearer " at the begining.
    idToken = request.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found.");
    return response.status(403).json({ error: "Unauthorized." });
  }

  // Verify token with firebase admin api
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      request.user = decodedToken;
      return db
        .collection(USERS_COLLECTION)
        .where("userId", "==", request.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
      request.user.username = data.docs[0].data().username;
      request.user.imageUrl = data.docs[0].data().imageUrl;
      return next();
    })
    .catch(error => {
      console.error("Error while verifying token.", error);
      return response.status(403).json(error);
    });
};
