//7:34
const express = require("express");
const server = express();

const cors = require("cors");

const mongoose = require("mongoose");
const { createProduct } = require("./Controller/Product");

const productsRouters = require("./routes/Products");
const brandsRouters = require("./routes/Brands");
const categoriesRouters = require("./routes/Category");

//middle-wares
server.use(cors());
server.use(express.json()); // to parse request body
server.use("/products", productsRouters.router);
server.use("/brands", brandsRouters.router);
server.use("/categories", categoriesRouters.router);

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("database connected");
}

main().catch((err) => console.log(err));

server.get("/", (req, res) => {
  res.json({ status: "success" });
});

server.post("/products", createProduct);

server.listen(8080, () => {
  console.log("Server started");
});
