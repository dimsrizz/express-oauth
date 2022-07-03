const express = require("express");
const { dashboard, home } = require("../controllers/view.controller");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.get("/", home);
router.get("/dashboard", isAuthenticated, dashboard);

module.exports = router;
