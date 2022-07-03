const jwt = require("jsonwebtoken");

class JWTUtils {
  static generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
  }

  static verifyAccessToken(accessToken) {
    return jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
  }
}

module.exports = JWTUtils;
