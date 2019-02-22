const express = require("express");
const router = express.Router();
const passport = require("passport");

//Schemas
const Experiece = require("../../models/Experience");
const Project = require("../../models/Project");
const About = require("../../models/About");
const Framework = require("../../models/Framework");
const Setting = require("../../models/Setting");

//cors middleware
const cors = require("cors");
router.options("/*", cors());

// Load validation
const validateExperienceInput = require("../../validation/experience");
const validateProjectInput = require("../../validation/project");
const validateAboutInput = require("../../validation/about");
const validateFrameworkInput = require("../../validation/framework");

//test
router.get("/test", (req, res) => {
  res.json({ Test: "Test route works" });
});

// Update Experience
router.patch(
  "/exp/:id",
  passport.authenticate("jwt", { session: false }),
  cors(),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const updatedExp = {
      from: req.body.from,
      to: req.body.to,
      desc: req.body.desc,
      emp: req.body.emp,
      responsibility: req.body.responsibility.split(",")
    };
    Experiece.findByIdAndUpdate(req.params.id, updatedExp)
      .then(patched =>
        res.status(200).json({ Success: "Successfully patched" })
      )
      .catch(err => res.json(err));
  }
);

//Update project
router.patch(
  "/project/:id",
  cors(),
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProjectInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const updatedProject = {
      projectname: req.body.projectname,
      desc: req.body.desc,
      githuburl: req.body.githuburl,
      demourl: req.body.demourl,
      features: req.body.features.split(","),
      imgsrc: req.body.imgsrc
    };
    Project.findByIdAndUpdate(req.params.id, updatedProject)
      .then(project => {
        res.status(200).json({
          Success: "Successfully patched",
          project
        });
      })
      .catch(err => res.json(err));
  }
);

//Update About
router.patch(
  "/about/:id",
  passport.authenticate("jwt", { session: false }),
  cors(),
  (req, res) => {
    const { errors, isValid } = validateAboutInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const updatedAbout = {
      name: req.body.name,
      bio: req.body.bio,
      region: req.body.region,
      contactemail: req.body.contactemail,
      github: req.body.github,
      linkedin: req.body.linkedin,
      imgsrc: req.body.imgsrc
    };
    About.findByIdAndUpdate(req.params.id, updatedAbout)
      .then(about => {
        res.status(200).json({
          Success: "Successfully patched",
          about
        });
      })
      .catch(err => res.status(404).json(err));
  }
);

//Patch Framework
router.patch(
  "/framework/:id",
  passport.authenticate("jwt", { session: false }),
  cors(),
  (req, res) => {
    const { errors, isValid } = validateFrameworkInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const updatedFramework = {
      framework: req.body.framework,
      skills: req.body.skills.split(","),
      imgsrc: req.body.imgsrc
    };

    Framework.findByIdAndUpdate(req.params.id, updatedFramework)
      .then(framework => {
        res.status(200).json({
          Success: "Successfully patched",
          framework
        });
      })
      .catch(err => res.status(404).json(err));
  }
);

//Patch settings
router.patch(
  "/setting/:id",
  passport.authenticate("jwt", { session: false }),
  cors(),
  (req, res) => {
    const updatedSetting = {
      disableRegisterPage: req.body.disableRegisterPage
    };
    Setting.findByIdAndUpdate(req.params.id, updatedSetting)
      .then(setting => {
        res.status(200).json({
          Success: "Successfully patched",
          setting
        });
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
