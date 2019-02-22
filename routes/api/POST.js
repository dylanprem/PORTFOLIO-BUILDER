const express = require("express");
const router = express.Router();

//Passport middleware
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//Schemas
const Experiece = require("../../models/Experience");
const Project = require("../../models/Project");
const About = require("../../models/About");
const Framework = require("../../models/Framework");
const User = require("../../models/User");
const Setting = require("../../models/Setting");

// cors middleware
const cors = require("cors");
router.options("/*", cors());

// Load validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateExperienceInput = require("../../validation/experience");
const validateProjectInput = require("../../validation/project");
const validateAboutInput = require("../../validation/about");
const validateFrameworkInput = require("../../validation/framework");

// Register
router.post("/register", cors(), (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//Login
router.post("/login", cors(), (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name }; // Create JWT Payload
        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

//Post experience
router.post(
  "/add/exp",
  passport.authenticate("jwt", { session: false }),
  cors(),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newExp = {
      from: req.body.from,
      to: req.body.to,
      desc: req.body.desc,
      emp: req.body.emp,
      responsibility: req.body.responsibility.split(",")
    };
    new Experiece(newExp)
      .save()
      .then(exp => res.json(exp))
      .catch(err => res.json(err));
  }
);

//Post project
router.post(
  "/add/project",
  passport.authenticate("jwt", { session: false }),
  cors(),
  (req, res) => {
    const { errors, isValid } = validateProjectInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newProject = {
      projectname: req.body.projectname,
      desc: req.body.desc,
      githuburl: req.body.githuburl,
      demourl: req.body.demourl,
      features: req.body.features.split(","),
      imgsrc: req.body.imgsrc
    };
    new Project(newProject)
      .save()
      .then(project => res.status(200).json(project))
      .catch(err => res.json(err));
  }
);

//Post About
router.post(
  "/add/about",
  passport.authenticate("jwt", { session: false }),
  cors(),
  (req, res) => {
    const { errors, isValid } = validateAboutInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newAbout = {
      name: req.body.name,
      bio: req.body.bio,
      region: req.body.region,
      contactemail: req.body.contactemail,
      github: req.body.github,
      linkedin: req.body.linkedin,
      imgsrc: req.body.imgsrc
    };
    new About(newAbout)
      .save()
      .then(about => res.status(200).json(about))
      .catch(err => res.json(err));
  }
);

//Post Framework
router.post(
  "/add/framework",
  passport.authenticate("jwt", { session: false }),
  cors(),
  (req, res) => {
    const { errors, isValid } = validateFrameworkInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newFramework = {
      framework: req.body.framework,
      skills: req.body.skills.split(","),
      imgsrc: req.body.imgsrc
    };

    new Framework(newFramework)
      .save()
      .then(framework => res.status(200).json(framework))
      .catch(err => res.json(err));
  }
);

//Post Setting
router.post(
  "/add/setting",
  passport.authenticate("jwt", { session: false }),
  cors(),
  (req, res) => {
    const newSetting = {
      disableRegisterPage: req.body.disableRegisterPage
    };
    new Setting(newSetting)
      .save()
      .then(setting => res.status(200).json(setting))
      .catch(err => res.json(err));
  }
);

module.exports = router;
