const firebaseConfig = require("../../utils/config");
const { admin, db } = require("../../utils/admin");
const { USERS_ROUTE } = require("../constants");

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
        return db
          .doc(`${USERS_ROUTE}/${request.user.username}`)
          .update({ imageUrl });
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
