const admin = require("../../utils/admin");
const { db } = require("../../utils/database");
const config = require("../../utils/config");

exports.updateOne = (req, res, next) =>
  db
    .doc(`/users/${req.user.username}`)
    .update(req.body)
    .then(() => res.status(200).json({ message: "Profile updated" }))
    .catch((err) => next(new Error(err)));

exports.getOwn = (req, res, next) =>
  db
    .doc(`/users/${req.user.username}`)
    .get()
    .then((user) => res.status(200).json({ ...user.data() }))
    .catch((err) => next(new Error(err)));

exports.getOther = (req, res, next) =>
  db
    .doc(`/users/${req.params.id}`)
    .get()
    .then((user) => res.status(200).json({ ...user.data() }))
    .catch((err) => next(new Error(err)));

exports.uploadImage = (req, res, next) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  // Initialize these variables here so that they are in the handlers scope
  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    // If statement checks whether uploaded file is the right format.
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({
        error: "Wrong file type submitted, please submit either a jpeg or png",
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
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() =>
        db.doc(`/users/${req.user.username}`).update({
          imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`,
        })
      )
      .then(() => res.status(200).json({ message: "Image uploaded" }))
      .catch((err) => next(new Error(err)));
  });

  busboy.end(req.rawBody);
};
