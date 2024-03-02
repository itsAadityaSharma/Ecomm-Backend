const express = require("express");
const { addToCart, fetchCartByUser } = require("../Controller/Cart");

const router = express.Router();

// /products is alreday added in base path
router.post("/", addToCart).get("/", fetchCartByUser);

exports.router = router;
