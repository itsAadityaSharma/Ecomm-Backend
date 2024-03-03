const express = require("express");
const {
  createOrder,
  fetchOrderByUser,
  updateOrder,
  fetchAllOrders,
} = require("../Controller/Order");

const router = express.Router();

// /products is alreday added in base path
router
  .post("/", createOrder)
  .get("/user/:userId", fetchOrderByUser)
  .patch("/:id", updateOrder)
  .get("/", fetchAllOrders);

exports.router = router;
