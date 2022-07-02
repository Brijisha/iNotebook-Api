const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "Brijishaisaverygood$girl";
const fetchuser = require("../middleware/fetchuser");

//Route-1 Create a User using: POST "/api/auth/createuser" . Doesn't require auth. No login required.
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atlist 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    // If there are errors , return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check whether user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email is already exists" });
      }

      //Hash password which is passed in body
      const salt = await bcrypt.genSaltSync(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      req.body.password = secPass;

      //Create new user
      // user = await User.create({
      //   name: req.body.name,
      //   email: req.body.email,
      //   password: secPass,
      // });

      user = await User.create(req.body);

      //Take user id in data and generate token
      const data = {
        user: {
          id: user.id,
        },
      };

      // jwt.sign method takes user data (id here) and jwt secrete key to generate token
      const authToken = jwt.sign(data, JWT_SECRET);
      console.log(authToken);
      //res.json(user);

      //Send authToken in responese instead of user
      res.json({ authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//Route-2 Authenticate a User using : POST "/api/auth/login". No logon required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    //If there are errors, return Bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credintials" });
      }

      //compare password
      const passwordCompare = await bcrypt.compare(password, user.password);

      //Password is not matched
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credintials" });
      }
      //Password is  matched
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      //Send authToken in responese instead of user
      res.json({ authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//Route-3 Get Loggedin User details using :POST "api/auth/getuser". Login requires
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occured");
  }
});
module.exports = router;
