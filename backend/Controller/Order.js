const { Order } = require("../Model/Order");

exports.fetchOrderByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ user: userId }).populate("user");
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const doc = await order.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllOrders = async (req, res) => {
  //here we need all query String
  let query = Order.find({});
  let queryCount = Order.find({});

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
