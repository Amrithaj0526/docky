const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING(20),
        defaultValue: 'user',
        allowNull: false,
    },
}, {
    tableName: 'users',
    timestamps: false, // Requirement didn't implicitly ask for these on User, but good to have? Requirement said "Users Table: id, name, email, password, role". I'll stick to requirement structure strictly but Sequelize adds timestamps by default unless disabled. I'll disable them to match spec strictly or keep them? Spec doesn't mention them for User, but does for Submission. I'll disable for User to be precise.
});

// Hook to hash password before saving
User.beforeCreate(async (user) => {
    if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

User.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = User;
