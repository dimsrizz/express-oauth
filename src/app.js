const path = require("path");

require("dotenv").config();
require("express-async-errors");

const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const passport = require("passport");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();

// Views engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// middlewares
const AppError = require("./utils/error");

// Initialize passportjs conf
require("./config/passport");

// logger
// if (process.env.NODE_ENV !== "development") {
//   app.use(morgan("dev"));
// }

// Router
const authRouter = require("./routes/auth.route");
const viewRouter = require("./routes/view.route");

// Security
app.use(cors());
app.set("trust proxy", 1);

// Parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  expressSession({
    name: "auth_session",
    secret: process.env.KEY_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

// passportjs middleware
app.use(passport.initialize());
app.use(passport.session());

// API endpoints

app.use("/", viewRouter);
app.use("/api/auth", authRouter);

// Not found error
app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} from our server`, 404));
});

// Error Handler
app.use((err, req, res, next) => {
  // return res.status(err.statusCode || 500).json({
  //   status: err.status || "Internal server error",
  //   message: err.message,
  //   stack: err.stack,
  // });

  res.render("error", {
    error: err
  })
});

module.exports = app;
