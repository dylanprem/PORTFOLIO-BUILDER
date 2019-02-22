const express = require("express");
const router = express.Router();
const passport = require("passport");

//Schemas
const Experience = require("../../models/Experience");
const Project = require("../../models/Project");
const Framework = require("../../models/Framework");
const About = require("../../models/About");
const Setting = require("../../models/Setting");

//cors middleware
const cors = require("cors");
router.options("/*", cors());

router.get("/test", (req, res) => {
  res.json({ Test: "Test route works" });
});

//Get Settings
router.get("/settings", cors(), (req, res) => {
  const errors = {};
  Setting.find()
    .populate("setting")
    .then(setting => res.json(setting))
    .catch(err => {
      if (!setting) {
        errors.nosettings = "There are no settings available";
        res.status(404).json(errors);
      }
    });
});

//Get Setting by id
router.get(
  "/setting/:id",
  passport.authenticate("jwt", { session: false }),
  cors(),
  (req, res) => {
    Setting.findById(req.params.id)
      .then(setting => res.json(setting))
      .catch(err => res.json(err));
  }
);

//Get experience
router.get("/experience", cors(), (req, res) => {
  const errors = {};
  Experience.find()
    .populate("experience")
    .then(exp => res.json(exp))
    .catch(err => {
      if (!exp) {
        errors.noexp = "There is no experience to display";
        res.status(404).json(errors);
      }
    });
});

//Get experience by id
router.get(
  "/experience/:id",
  passport.authenticate("jwt", { session: false }),
  cors(),
  (req, res) => {
    const errors = {};
    Experience.findById(req.params.id)
      .then(exp => res.status(200).json(exp))
      .catch(err => {
        if (!exp) {
          errors.noexp = "There is no experience to display by this id";
          res.status(404).json(errors);
        }
      });
  }
);

//Get Projects
router.get("/projects", cors(), (req, res) => {
  Project.find()
    .populate("projects")
    .then(project => res.json(project))
    .catch(err => {
      if (!project) {
        errors.noproject = "There are no projects to display";
        res.status(404).json(errors);
      }
    });
});

//Get Project by id
router.get(
  "/projects/:id",
  passport.authenticate("jwt", { session: false }),
  cors(),
  (req, res) => {
    Project.findById(req.params.id)
      .then(project => res.json(project))
      .catch(err => {
        if (!project) {
          errors.noproject = "There are no projects to display";
          res.status(404).json(errors);
        }
      });
  }
);

//Get Frameworks
router.get("/frameworks", cors(), (req, res) => {
  Framework.find()
    .populate("frameworks")
    .then(framework => res.json(framework))
    .catch(err => res.json(err));
});

//Get Framework by id
router.get(
  "/framework/:id",
  passport.authenticate("jwt", { session: false }),
  cors(),
  (req, res) => {
    Framework.findById(req.params.id)
      .then(framework => res.json(framework))
      .catch(err => res.json(err));
  }
);

//Get About info
router.get("/about", cors(), (req, res) => {
  About.find()
    .populate("abouts")
    .then(about => res.json(about))
    .catch(err => res.json(err));
});

//Get About info by id
router.get(
  "/about/:id",
  passport.authenticate("jwt", { session: false }),
  cors(),
  (req, res) => {
    About.findById(req.params.id)
      .then(about => res.json(about))
      .catch(err => {
        if (!about) {
          errors.noabout = "There is no about info to display";
          res.status(404).json(errors);
        }
      });
  }
);

module.exports = router;
