//9:21
const express = require("express");
const server = express();
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const crypto = require("crypto");

// const SQLiteStore = require("connect-sqlite3").session();
const LocalStrategy = require("passport-local").Strategy;

//Routes
const productsRouters = require("./routes/Products");
const brandsRouters = require("./routes/Brands");
const categoriesRouters = require("./routes/Category");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
const { User } = require("./Model/User");

//middle-wares

server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    // store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
  })
);
server.use(passport.authenticate("session"));

server.use(cors());
server.use(express.json()); // to parse request body
server.use("/products", isAuth, productsRouters.router);
server.use("/brands", brandsRouters.router);
server.use("/categories", categoriesRouters.router);
server.use("/users", userRouter.router);
server.use("/auth", authRouter.router);
server.use("/carts", cartRouter.router);
server.use("/orders", orderRouter.router);

//passport Strategy
passport.use(
  new LocalStrategy(async function (username, password, done) {
    //by default passport uses username
    try {
      const user = await User.findOne({ email: username }).exec();
      if (!user) {
        done(null, false, { message: "Invalid credentials" });
      }

      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            done(null, false, { message: "Invalid credentials" });
          }
          done(null, user);
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

//Serialize & Deserialize
//This creates session variables req.user on being called
passport.serializeUser(function (user, cb) {
  console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

//This creates session variables req.user when called from authorized request
passport.deserializeUser(function (user, cb) {
  console.log("de-serialize", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

main().catch((err) => console.log(err));

//Databse connection
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("Database connected");
}

server.get("/", (req, res) => {
  res.json({ status: "success" });
});

function isAuth(req, res, done) {
  if (req.user) {
    done();
  } else {
    res.send(401);
  }
}

server.listen(8080, () => {
  console.log("Server started");
});
