const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Deadline = sequelize.define('Deadline', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    tableName: 'deadlines',
    timestamps: false,
});

module.exports = Deadline;
