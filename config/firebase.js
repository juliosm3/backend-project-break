const admin = require("firebase-admin");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const serviceAccount = require(path.join(__dirname, "..", process.env.FIREBASE_CREDENTIALS));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
