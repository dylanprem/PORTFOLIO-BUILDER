const express = require("express");
const router = express.Router();

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

//cors middleware
const cors = require("cors");
router.options("/*", cors());

//test
router.get("/test", (req, res) => {
  res.json({ Test: "Test route works" });
});

// @route DEL
// @desc delete img
// @access Public
router.delete(
  "/image/:id",
  cors(),
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    gfs.remove({ _id: req.params.id, root: "uploads" }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      } else {
        return res.status(200).json({ Success: "Deleted" });
      }
    });
  }
);

module.exports = router;
