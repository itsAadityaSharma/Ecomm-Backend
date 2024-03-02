const express = require("express");
const { createUser, loginUser } = require("../Controller/Auth");

const router = express.Router();

// /products is alreday added in base path
router.post("/signup", createUser).post("/login", loginUser);

exports.router = router;
