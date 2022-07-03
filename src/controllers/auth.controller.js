const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const { User } = require("../models/index");
const AppError = require("../utils/error");

const JWTUtils = require("../utils/jwt-utils");
const { sendMail } = require("../utils/email");
const { Op } = require("sequelize");

const sendTokenAndResponse = (user, statusCode, res) => {
  const token = JWTUtils.generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const cookieOptions = {
    expiresIn: "1d",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("access_token", token, cookieOptions).status(statusCode).json({
    status: "success",
    access_token: token,
    token_type: "Bearer",
    expires_in: "24 hours",
    user,
  });
};

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(new AppError("please input username,email or password", 400));
  }

  const isUserExist = await User.findOne({ where: { email } });
  if (isUserExist) return next(new AppError("Email already in use", 400));

  const newUser = await User.create({
    username,
    email,
    password,
    role: "admin",
  });

  sendTokenAndResponse(newUser, 201, res);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("please input valid email or password", 400));

  const user = await User.findOne({ where: { email } });
  if (!user)
    return next(new AppError("Invalid email or password, cant find user", 401));

  console.log(user);

  const passwordCorrect = await user.comparePassword(password, user.password);
  if (!passwordCorrect)
    return next(new AppError("Incorrect email or password", 401));

  sendTokenAndResponse(user, 200, res);
};

exports.logout = (req, res) => {
  // User login with google
  if (req.session) {
    req.session.destroy();
    req.session = null;
  }

  if (req.cookies.access_token) {
    res.clearCookie("access_token");
  }

  req.logout();
  res.cookie("logout", "logout", {
    expiresIn: 1,
  });
  res.status(200).json({ message: "Successfully logged out" });
};

exports.forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    next(new AppError("Please input email", 400));
  }

  const user = await User.findOne({ where: { email } });
  if (!user) next(new AppError("No user found", 400));

  const resetToken = user.createPasswordResetToken(user);
  await user.save({ validate: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/reset-password/${user.id}/${resetToken}`;

  console.log(resetUrl);

  const html = `
  <h2 style="text-align: center">Reset Password</h2>
  <p>Forget your password? submit patch request to <a >${resetUrl}</a> with new password</p>
  `;

  const sendMailToUser = await sendMail(
    {
      to: email,
      subject: "Reset Password",
      html,
    },
    email
  );

  console.log(sendMailToUser);

  res.status(200).json({
    status: "success",
    message: "Reset password has sent to email!",
  });
};

exports.resetPassword = async (req, res, next) => {
  const { token, userID } = req.params;
  const { new_password, confirm_password } = req.body;

  const user = await User.findOne({
    where: { id: userID, resetTokenExpires: { [Op.gt]: Date.now() } },
  });

  if (!user) return next(new AppError("Token already expired", 401));

  if (!new_password || !confirm_password)
    return next(
      new AppError("please input new password and confirm password", 400)
    );

  if (new_password !== confirm_password) {
    return next(new AppError("password did not match", 400));
  }

  user.password = new_password;
  user.passwordResetToken = null;
  user.resetTokenExpires = null;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "password is changed, logging in",
  });
};
