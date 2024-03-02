const { Product } = require("../Model/Product");

exports.createProduct = (req, res) => {
  const product = new Product(req.body);
  product
    .save()
    .then(() => {
      res.status(201).json(product);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.fetchAllProducts = async (req, res) => {
  //here we need all query String
  let query = Product.find({});
  let queryCount = Product.find({});

  if (req.query.category) {
    query = query.find({ category: req.query.category });
    queryCount = queryCount.find({ category: req.query.category });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    queryCount = queryCount.find({ brand: req.query.brand });
  }

  if (req.query._sort) {
    query = query.sort({ [req.query._sort]: "asc" });
    queryCount = queryCount.sort({ [req.query._sort]: "asc" });
  }

  if (req.query._page) {
    const pageSize = 10;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    const item = await queryCount.countDocuments();
    res.status(200).json({ items: item, data: docs });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};
