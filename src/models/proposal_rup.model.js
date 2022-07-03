"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProposalRUP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //
    }
  }

  ProposalRUP.init(
    {
      nama_sekolah: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      methode_pembayaran: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      triwulan_pembayaran: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jumlah_dana: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nama_kegiatan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nama_penerima: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("process", "pending", "success", "canceled"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProposalRUP",
      timestamps: true,
      underscored: true,
    }
  );

  return ProposalRUP;
};
