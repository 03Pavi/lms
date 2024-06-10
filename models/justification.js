"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class justification extends Model {

    static justification_attendance_association;

    static associate(models) {
      // define association here

      this.justification_attendance_association = justification.belongsTo(models.attendance, {
        foreignKey: "attendance_id",
        as: "attendance", // alias for the association
      });

    }
  }
  justification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      attendance_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "attendances",
          key: "id",
        },
        validate: {
          notNull: {
            msg: "Attendances id is required.",
          },
        },
      },
      comment: {
        type: DataTypes.STRING(255),
        validate: {
          notEmpty: {
            msg: "Comment cannot be empty.",
          },
        },
      },
      file: {
        type: DataTypes.STRING(255),
        validate: {
          notEmpty: {
            msg: "File cannot be empty.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "justification",
      paranoid: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return { justification };
};
