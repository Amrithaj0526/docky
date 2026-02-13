const sequelize = require('../config/database');
const User = require('./User');
const Submission = require('./Submission');
const Deadline = require('./Deadline');

const db = {
    sequelize,
    User,
    Submission,
    Deadline,
};

module.exports = db;
