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
  let queryCount;
  let query;
  if (req.query.admin) {
    query = Product.find({});
    queryCount = Product.find({});
  } else {
    query = Product.find({ deleted: { $ne: true } });
    queryCount = Product.find({ deleted: { $ne: true } });
  }

  if (req.query.category) {
    let cat = req.query.category.split("_");
    cat.splice(cat.length - 1, 1);

    query = query.find({ category: { $in: cat } });
    queryCount = queryCount.find({ category: { $in: cat } });
  }
  if (req.query.brand) {
    let brandArr = req.query.brand.split("_");
    brandArr.splice(brandArr.length - 1, 1);
    query = query.find({ brand: { $in: brandArr } });
    queryCount = queryCount.find({ brand: { $in: brandArr } });
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
