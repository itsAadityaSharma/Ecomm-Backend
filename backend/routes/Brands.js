const express = require("express");
const { fetchBrands } = require("../Controller/Brands");

const router = express.Router();

// /products is alreday added in base path
router.get("/", fetchBrands);

exports.router = router;
