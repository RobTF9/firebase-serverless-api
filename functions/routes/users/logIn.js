const firebase = require("firebase");
const { validateLoginDetails } = require("../../utils/validators");

exports.logIn = (request, response) => {
  const { email, password } = request.body;

  const user = {
    email,
    password
  };

  const { valid, errors } = validateLoginDetails(user);

  if (!valid) return response.status(400).json(errors);

  // Use firebase methods to validate authentication request.
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => data.user.getIdToken())
    .then(token => response.json({ token }))
    .catch(error => {
      console.error(error);
      if (error.code === "auth/wrong-password") {
        return response
          .status(403)
          .json({ general: "Wrong credentials, please try again." });
      } else {
        return response.status(500).json({ error: error.code });
      }
    });
};
