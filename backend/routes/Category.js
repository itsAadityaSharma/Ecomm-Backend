const express = require("express");
const { fetchCategory } = require("../Controller/Category");

const router = express.Router();

// /products is alreday added in base path
router.get("/", fetchCategory);

exports.router = router;
