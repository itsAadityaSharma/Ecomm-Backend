//10:34:00
const express = require("express");
const server = express();
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const crypto = require("crypto");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
//Routes
const productsRouters = require("./routes/Products");
const brandsRouters = require("./routes/Brands");
const categoriesRouters = require("./routes/Category");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
const cookieParser = require("cookie-parser");
const { User } = require("./Model/User");
const { sanitizerUser, isAuth, cookieExtractor } = require("./services/common");

const SECRET_KEY = "SECRET_KEY";
//RazorPay
const Razorpay = require("razorpay");
const path = require("path");
require("dotenv").config();

//JST options
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY; //TODO : should not be in code

//middle-wares

server.use(express.static("build"));
server.use(cookieParser());

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
server.use("/products", isAuth(), productsRouters.router); //we can also use JWT token for client-only auth
server.use("/brands", isAuth(), brandsRouters.router);
server.use("/categories", isAuth(), categoriesRouters.router);
server.use("/users", isAuth(), userRouter.router);
server.use("/auth", authRouter.router);
server.use("/carts", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), orderRouter.router);
server.use(express.urlencoded({ extended: true }));

//passport Strategy

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email }).exec();
      if (!user) {
        return done(null, false, { message: "Invalid credentials" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "Invalid credentials" });
          }
          const token = jwt.sign(sanitizerUser(user), SECRET_KEY);
          done(null, {
            id: user.id,
            role: user.role,
            email: user.email,
            token,
          });
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

// JWT Strategy
passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({ jwt_payload });
    try {
      const user = await User.findById(jwt_payload.id.id);
      if (user) {
        return done(null, sanitizerUser(user)); //this calls serializer user
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
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
  console.log("de-serialize-----------------", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

//--------------------------------------------------------------------------
// RZP PAYMENT

const instance = new Razorpay({
  key_id: process.env.RAZOR_PAY_API_KEY,
  key_secret: process.env.RAZOR_PAY_API_SECRET,
});

server.get("/getKey", (req, res) => {
  res.status(200).json({ key: process.env.RAZOR_PAY_API_KEY });
});

server.post("/razorpay", async (req, res) => {
  const options = {
    amount: Number(req.body.amount) * 80,
    currency: "INR",
  };
  try {
    const order = await instance.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
});
server.post("/paymentVerification", async (req, res) => {
  res.status(200).json({ success: true });
});

//--------------------------------------------------------------------------

//Payment
const stripe = require("stripe")(
  "sk_test_51OsKT3SGlh95KKhLdrWzP2MPEJkUTcfHuUlnp2gqpktiwZkiFb9tuPAxJMMXn0E4LFKwC8u58uDrGFTnKDU2RIsZ00qt3UlhvL"
);

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

server.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "inr",
    description: "Payment for goods or services",
    payment_method_types: "card",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
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

server.listen(8080, () => {
  console.log("Server started");
});
