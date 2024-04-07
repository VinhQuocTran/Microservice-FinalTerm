const {DataTypes} = require('sequelize');
const sequelize = require('../database/connection');
const bcrypt = require('bcryptjs');

const User = sequelize.define('users', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please fill your name',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'Please fill your email',
      },
      isEmail: {
        msg: 'Please provide a valid email',
      },
    },
    lowercase: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
    trim: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please fill your password',
      },
      len: {
        args: [6],
        msg: 'Password must be at least 6 characters long',
      },
    },
    set(value) {
      // Hash the password before saving
      const hashedPassword = bcrypt.hashSync(value, 12);
      this.setDataValue('password', hashedPassword);
    },
  },
  role: {
    type: DataTypes.ENUM('admin', 'teacher', 'student'),
    defaultValue: 'student',
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize,
  modelName: 'User',
  timestamps: true,
  underscored: true,
});

module.exports = User;
