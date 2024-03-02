const express = require("express");
const {
  createProduct,
  fetchAllProducts,
  fetchAllProductById,
  updateProduct,
} = require("../Controller/Product");

const router = express.Router();

// /products is alreday added in base path
router
  .post("/", createProduct)
  .get("/", fetchAllProducts)
  .get("/:id", fetchAllProductById)
  .patch("/:id", updateProduct);

exports.router = router;
