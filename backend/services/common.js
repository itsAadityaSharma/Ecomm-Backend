const passport = require("passport");

exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt", { session: false });
};

exports.sanitizerUser = (user) => {
  return { id: user, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    {
      token = req.cookies["jwt"];
    }
  }
  //TODO : this is temporary token for testing without cookie

  return token;
};
