const express = require("express");
const passport = require("passport");
const { createUser, loginUser, checkUser } = require("../Controller/Auth");

const router = express.Router();

// /products is alreday added in base path
router
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  .get("/check", checkUser);

exports.router = router;
