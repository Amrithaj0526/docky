const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Submission = sequelize.define('Submission', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    file_name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    file_path: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
}, {
    tableName: 'submissions',
    timestamps: false, // We look at 'created_at' manually defined above to match spec.
    createdAt: 'created_at', // Map Sequelize's createdAt to our column if we wanted, but we defined it manually.
    updatedAt: false,
});

// Define association
User.hasMany(Submission, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Submission.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Submission;
