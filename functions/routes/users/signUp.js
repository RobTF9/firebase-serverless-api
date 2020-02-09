const firebase = require("firebase");
const firebaseConfig = require("../../utils/config");
const { db } = require("../../utils/admin");
const { USERS_ROUTE } = require("../constants");
const { validateSignUpDetails } = require("../../utils/validators");

exports.signUp = (request, response) => {
  const { username, email, password, confirmPassword } = request.body;

  const newUser = {
    email,
    username,
    password,
    confirmPassword
  };

  const { valid, errors } = validateSignUpDetails(newUser);

  if (!valid) return response.status(400).json(errors);

  // Intialize token and id
  let userToken, userId;

  db.doc(`${USERS_ROUTE}/${newUser.username}`)
    .get()
    .then(doc => {
      // Check if the username already exsists, if it does send 400 as response.
      if (doc.exists) {
        return response
          .status(400)
          .json({ username: "Username is already in use." });
      } else {
        // return new user if username not take.
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    // Get the token attached to the user
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    // Put the token into a json response
    .then(token => {
      userToken = token;
      // Create user details to pass into users collection
      const userDetails = {
        username: newUser.username,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/no-image.png?alt=media`,
        userId
      };
      return db.doc(`${USERS_ROUTE}/${newUser.username}`).set(userDetails);
    })
    .then(() => response.status(201).json({ userToken }))
    // Catch any errors
    .catch(error => {
      console.error(error);
      // If error is because email is already in use then return 400
      if (error.code === "auth/email-already-in-use") {
        return response.status(400).json({ email: "Email is already in use." });
      } else {
        return response
          .status(500)
          .json({ general: "Something went wrong, please try again." });
      }
    });
};
