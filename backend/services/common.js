const passport = require("passport");

exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};

exports.sanitizerUser = (user) => {
  return { id: user, role: user.role };
};
