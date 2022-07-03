const express = require("express");
const passport = require("passport");

const { AuthController } = require("../controllers/index");

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

router.post("/forget-password", AuthController.forgetPassword);
router.post("/reset-password/:userID/:token", AuthController.resetPassword);

// Google 0Auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/sign-in",
  })
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["public_profile", "email"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/error" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = router;
