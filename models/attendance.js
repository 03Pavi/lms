'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class attendance_status_enum  {
    
    static attendance_statuses = {
      PRESENTED: 'presented',
      ABSENT: 'absent',
      LATE: 'late',
      DISPENSED: 'dispensed',
      JUSTIFIED: 'justified'
    }

    static get_available_statuses() {
      const status_keys = Object.keys(attendance_status_enum.attendance_statuses)
      return status_keys.map(key => (attendance_status_enum.attendance_statuses[key]));
    }
  }

  class attendance extends Model {
    
    static attendance_session_association;
    static attendance_student_association;
    static attendance_justification_association;

    static get_attendance_statuses_for_justification() {
      const excluded_statuses = ['DISPENSED', 'PRESENTED'];

      return Object.values(attendance_status_enum.attendance_statuses).filter(
        status => !excluded_statuses.includes(status)
      );
    }

    static associate(models) {
      // define association here

      this.attendance_session_association = attendance.belongsTo(models.session, {
        foreignKey: "session_id",
        as: "session", // alias for the association
      });

      this.attendance_student_association = attendance.belongsTo(models.student, {
        foreignKey: "student_id",
        as: "student", // alias for the association
      });

      this.attendance_justification_association = attendance.hasOne(models.justification, {
        foreignKey: "attendance_id",
        as: "justification", // alias for the association
      });

    }
  }
  attendance.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    session_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'sessions',
        key: 'id',
      },
      allowNull: false,
      unique: 'session_student_unique',
      validate: {
        notNull: {
          msg: 'Session id is required.'
        }
      }
    },
    student_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'students',
        key: 'id',
      },
      allowNull: false,
      unique: 'session_student_unique',
      validate: {
        notNull: {
          msg: 'Student id is required.'
        }
      }
    },
    status: {
      type: DataTypes.ENUM(attendance_status_enum.get_available_statuses()),
      allowNull: true,
      validate: {
        isIn: {
          args: [attendance_status_enum.get_available_statuses()],
          msg: 'Invalid status value.',
        },
      },
    },
    previous_status: {
      type: DataTypes.ENUM(attendance_status_enum.get_available_statuses()),
      allowNull: true,
      validate: {
        isIn: {
          args: [attendance_status_enum.get_available_statuses()],
          msg: 'Invalid previous status value.',
        },
      },
    }
  }, {
    sequelize,
    modelName: 'attendance',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  
  return { attendance, attendance_status_enum };
};