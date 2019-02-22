const express = require("express");
const router = express.Router();
//cors middleware
const cors = require("cors");
router.options("/*", cors());

//passport
const passport = require("passport");

//GridFs middleware
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const crypto = require("crypto");
const path = require("path");
const GridFsStorage = require("multer-gridfs-storage");
const multer = require("multer");

// DB Connection
const db = process.env.MONGODB_URI;

const conn = mongoose.createConnection(db);
let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Storage
const storage = new GridFsStorage({
  url: db,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

//test
router.get("/test", (req, res) => {
  res.json({ Test: "Test route works" });
});

// @route POST
// @access Private
router.post(
  "/image/uploads",
  cors(),
  upload.single("image"),
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.status(200).json({
      Success: "Uploaded"
    });
  }
);

module.exports = router;
