const express = require("express");
const router = express.Router();

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

// @route GET
// @desc image by filename
// @access Public
router.get("/image/:filename", cors(), (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check for existance
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "NO FILE EXISTS"
      });
    }

    // Check if it's an image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "NOT AN IMAGE"
      });
    }
  });
});

// @route GET
// @desc Get all images
// @access Public
router.get("/images", cors(), (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || !files.length === 0) {
      return res.status(404).json({
        err: "Files do not exist"
      });
    } else {
      return res.status(200).json(files);
    }
  });
});

module.exports = router;
