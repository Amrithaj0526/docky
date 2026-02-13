const User = require('./models/User');
const sequelize = require('./config/database');

const listUsers = async () => {
    try {
        await sequelize.authenticate();
        const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role'] });
        console.log('--- Registered Users ---');
        console.log(JSON.stringify(users.map(u => u.toJSON()), null, 2));
    } catch (error) {
        console.error('Error listing users:', error);
    } finally {
        await sequelize.close();
    }
};

listUsers();
