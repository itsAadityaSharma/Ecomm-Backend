const passport = require("passport");

exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
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
  // token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6eyJlbWFpbCI6InRlc3QxQGdtYWlsLmNvbSIsInBhc3N3b3JkIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjpbMjEwLDgsMjIsMTM0LDcsMjIsMjM5LDE3Miw3MSwyMjgsMTYsNjksNDgsMTk0LDE2MywxNSwxNjUsMjEsMjI1LDIwMywyNSwxMzQsMjgsMjI0LDExMyw0NSwyMywyMjQsMTgyLDEwMCwxMjUsMTYzXX0sInJvbGUiOiJhZG1pbiIsImFkZHJlc3NlcyI6W10sIm9yZGVycyI6W10sInNhbHQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOlsyMTYsMTI5LDMyLDI4LDE5NCw2NiwxNzgsNTEsNTYsMTIyLDIsMTM3LDMyLDE0OCwxMjEsMjEyXX0sImlkIjoiNjVlOGFjZjU1MDNhMjBmN2FkNWRiNmNhIn0sInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwOTgyOTg3NH0.LtYYRsvuEx6HB659fgeRlA_UYSfbbYA3IIZ9TpzSaO4";
  return token;
};
