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
  return firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => data.user.getIdToken())
    .then(token => response.json({ token }))
    .catch(error => {
      console.error(error);
      return response
        .status(403)
        .json({ general: "Wrong email or password, please try again." });
    });
};
