"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class group extends Model {

    static group_academic_element_association;
    static group_academic_period_association;
    static group_teacher_association;
    static group_student_association;
    static group_session_association;

    static associate(models) {
      this.group_academic_element_association = group.belongsTo(models.academic_element, {
        foreignKey: "academic_element_id",
        as: "academic_element", // alias for the association
      });

      this.group_academic_period_association = group.belongsTo(models.academic_period, {
        foreignKey: "academic_period_id",
        as: "academic_period", // alias for the association
        include: [
          {
            model: models.academic_period,
            as: 'parent_academic_period', // alias for the association
          },
        ],
      });

      this.group_teacher_association = group.belongsToMany(models.teacher, {
        through: models.group_teacher,
        foreignKey: "group_id",
        otherKey: "teacher_id",
        as: "teachers", // alias for the association
      });

      this.group_student_association = group.belongsToMany(models.student, {
        through: models.group_student,
        foreignKey: "group_id",
        otherKey: "student_id",
        as: "students", // alias for the association
      });

      this.group_session_association = group.hasMany(models.session, {
        foreignKey: "group_id",
        as: "sessions", // alias for the association
      });

    }
  }

  group.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'UUID cannot be empty.',
          },
        },
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notNull:{
            msg: 'Name is required.'
          },
          notEmpty: {
            msg: 'Name cannot be empty.',
          },
        },
      },
      settings: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Settings cannot be empty.'
          },
          notNull:{
            msg: 'Settings is required.'
          },
        },
      },
      academic_element_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'academic_elements',
          key: 'id',
        },
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Academic element id is required.'
          },
        }
      },
      academic_period_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'academic_periods',
          key: 'id',
        },
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Academic period id is required.'
          }
        }
      },
    },
    {
      sequelize,
      modelName: "group",
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return { group };
};
