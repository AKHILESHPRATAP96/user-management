const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectionDB');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    trim: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'Employee',
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  department: {
    type: DataTypes.STRING,
  },
  token: {
    type: DataTypes.STRING,
  },
  passwordResetToken: {
    type: DataTypes.STRING,
  },
  passwordResetTokenExpire: {
    type: DataTypes.DATE,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  assignedLeads: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  monthlyAssignedLeads: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  yearlyAssignedLeads: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  monthlyTarget: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
  },
});

// Instance Method — Generate JWT Token
User.prototype.generateToken = function () {
  return jwt.sign(
    {
      userId: this.id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRECT_KEY,
    { expiresIn: '30d' }
  );
};

// Instance Method — Create Reset Password Token
User.prototype.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 mins
  return resetToken;
};

module.exports = User;
