const express = require("express");
const router = express.Router();
const passport = require("passport");

//Schemas
const Experiece = require("../../models/Experience");
const Project = require("../../models/Project");
const About = require("../../models/About");
const Framework = require("../../models/Framework");

//cors middleware
const cors = require("cors");
router.options("/*", cors());

//test
router.get("/test", (req, res) => {
  res.json({ Test: "Test route works" });
});

// Delete Experience
router.delete(
  "/exp/:id",
  cors(),
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Experiece.findByIdAndDelete(req.params.id)
      .then(deleted =>
        res.status(200).json({ Success: "Successfully deleted" })
      )
      .catch(err => res.json(err));
  }
);

// Delete Project
router.delete(
  "/project/:id",
  cors(),
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.findByIdAndDelete(req.params.id)
      .then(deleted =>
        res.status(200).json({ Success: "Successfully deleted", deleted })
      )
      .catch(err => res.json(err));
  }
);

// Delete About
router.delete(
  "/about/:id",
  cors(),
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    About.findByIdAndDelete(req.params.id)
      .then(deleted =>
        res.status(200).json({ Success: "Successfully deleted" })
      )
      .catch(err => res.json(err));
  }
);

// Delete Framework
router.delete(
  "/framework/:id",
  cors(),
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Framework.findByIdAndDelete(req.params.id)
      .then(deleted =>
        res.status(200).json({ Success: "Successfully deleted" })
      )
      .catch(err => res.json(err));
  }
);

module.exports = router;
