const { Category } = require("../Model/Category");

exports.fetchCategory = async (req, res) => {
  try {
    const category = await Category.find({}).exec();
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
};
