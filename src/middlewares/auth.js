const JWTUtils = require("../utils/jwt-utils");
const { User } = require("../models/index");
const AppError = require("../utils/error");

const isAuthenticated = async (req, res, next) => {
  let token;

  if (req.user) return next();

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.access_token) {
    token = req.cookies.access_token;
  } else {
    return next(new AppError("Unauthorized", 401));
  }

  if (!token) return next(new AppError("Unauthorized", 401));

  const userPayload = JWTUtils.verifyAccessToken(token);

  const user = await User.findOne({ where: { id: userPayload.id } });
  if (!user)
    return next(new AppError("token already expires, please login again", 401));

  req.user = freshUser;
  res.locals.user = freshUser;

  next();
};

const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError(
          "You do not have permission to access this, access is restricted",
          401
        )
      );

    next();
  };

module.exports = { isAuthenticated, restrictTo };
