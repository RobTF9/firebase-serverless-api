const firebase = require("firebase");
const firebaseConfig = require("../utils/config");
const { admin, db } = require("../utils/admin");
const { USERS_ROUTE, NOTIFICATIONS_COLLECTION } = require("./constants");
const { reduceUserDetails } = require("../utils/helpers");
const {
  validateLoginDetails,
  validateSignUpDetails
} = require("../utils/validators");

firebase.initializeApp(firebaseConfig);

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
        return response.status(500).json({ error: error.code });
      }
    });
};

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

exports.getUserDetails = (request, response) => {
  let userData = {};
  db.doc(`${USERS_ROUTE}/${request.user.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("likes")
          .where("username", "==", request.user.username)
          .get();
      }
    })
    .then(data => {
      userData.likes = [];
      data.forEach(doc => {
        userData.likes.push(doc.data());
      });
      return db
        .collection(NOTIFICATIONS_COLLECTION)
        .where("recipient", "==", request.user.username)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then(data => {
      userData.notifications = [];
      data.forEach(doc => {
        userData.notifications.push({
          createdAt: doc.data().createdAt,
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          type: doc.data().type,
          read: doc.data().read,
          workoutId: doc.data().workoutId,
          notificationId: doc.id
        });
      });
      return response.json(userData);
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};

exports.uploadProfileImage = (request, response) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: request.headers });

  // Initialize these variables here so that they are in the handlers scope
  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    // If statement checks whether uploaded file is the right format.
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return response.status(400).json({
        error: "Wrong file type submitted, please submit either a jpeg or png"
      });
    }
    // This splits the file name so that just the extension is returned.
    // Splidt twice in case there are multiple dots in the name e.g. my.image.png
    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    // Generate random number for image name and concat on file extensions
    imageFileName = `${Math.round(
      Math.random() * 1000000000
    )}.${imageExtension}`;

    // Get the filepath to the image that needs to be uploaded, using packages imported in the handler
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on("finish", () => {
    // Admin get's reference to the firebase storage bucket
    // Upload with the parameters in .upload
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        // This is where the reference is added to the users database entry
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${request.user.username}`).update({ imageUrl });
      })
      .then(() => {
        return response.json({ message: "image uploaded successfully" });
      })
      .catch(err => {
        console.error(err);
        return response.status(500).json({ error: "something went wrong" });
      });
  });
  busboy.end(request.rawBody);
};
