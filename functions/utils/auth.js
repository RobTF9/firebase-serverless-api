const firebase = require("firebase");
const admin = require("./admin");
const { db, users } = require("./database");
const { newUserModel } = require("../resources/users/user.model");

exports.signin = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.status(400);
    return next(new Error("Error: Invalid sign in details"));
  }

  return firebase
    .auth()
    .signInWithEmailAndPassword(req.body.email, req.body.password)
    .then((data) => data.user.getIdToken())
    .then((token) => res.status(200).json({ token }))
    .catch((err) => {
      res.status(400);
      return next(new Error(err));
    });
};

exports.signup = (req, res, next) => {
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.confirmPassword ||
    !req.body.username
  ) {
    res.status(400);
    return next(new Error("Error: Invalid sign up details"));
  } else if (req.body.password !== req.body.confirmPassword) {
    res.status(400);
    return next(new Error("Error: Passwords must match"));
  }

  return db
    .doc(`/users/${req.body.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        res.status(400);
        return next(
          new Error("Error: A user with that username already exsists")
        );
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(req.body.email, req.body.password);
      }
    })
    .then((data) => {
      newUserModel(req.body.email, req.body.username, data.user.uid);
      return data.user.getIdToken();
    })
    .then((token) => res.status(201).json({ token }))
    .catch((err) => {
      res.status(400);
      return next(new Error(err));
    });
};

exports.protect = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401);
    return next(new Error("Error: Unauthorized"));
  }

  let token = req.headers.authorization.split("Bearer ")[1];

  if (!token) {
    res.status(401);
    return next(new Error("Error: Unauthorized"));
  }

  return admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      req.user = decodedToken;
      return users.where("id", "==", req.user.uid).limit(1).get();
    })
    .then((data) => {
      req.user = data.docs[0].data();
      return next();
    })
    .catch((err) => {
      res.status(403);
      return next(new Error(err));
    });
};
