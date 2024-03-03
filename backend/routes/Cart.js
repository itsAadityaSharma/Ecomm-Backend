const express = require("express");
const {
  addToCart,
  fetchCartByUser,
  updateCart,
  deleteFromCart,
} = require("../Controller/Cart");

const router = express.Router();

// /products is alreday added in base path
router
  .post("/", addToCart)
  .get("/", fetchCartByUser)
  .patch("/:id", updateCart)
  .delete("/:id", deleteFromCart);

exports.router = router;
