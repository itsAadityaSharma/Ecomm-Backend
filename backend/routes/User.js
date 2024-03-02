const express = require("express");
const { updateUser, fetchUserById } = require("../Controller/User");

const router = express.Router();

// /products is alreday added in base path
router.get("/:id", fetchUserById).patch("/:id", updateUser);

exports.router = router;
