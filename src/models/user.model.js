"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

const crypto = require("crypto");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      photoProfile: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      role: {
        type: DataTypes.ENUM("user", "admin"),
        defaultValue: "user",
      },
      passwordResetToken: {
        type: DataTypes.STRING,
      },
      resetTokenExpires: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,
      underscored: true,
      hooks: {
        beforeSave: async function (user) {
          const hashedPassword = await bcrypt.hash(user.password, 12);
          user.password = hashedPassword;
        },
      },
    }
  );

  // Static methods
  User.prototype.comparePassword = async function (password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  };

  User.prototype.createPasswordResetToken = (user) => {
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetTokenExpires = Date.now() + 24 * 1000 * 60 * 60;

    return resetToken;
  };

  return User;
};
