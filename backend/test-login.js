const User = require('./models/User');
const sequelize = require('./config/database');

const testLogin = async (email, password) => {
    try {
        await sequelize.authenticate();
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log(`User ${email} not found.`);
            return;
        }
        const isMatch = await user.validPassword(password);
        console.log(`Login test for ${email}: ${isMatch ? 'SUCCESS' : 'FAILED'}`);
    } catch (error) {
        console.error('Error during login test:', error);
    } finally {
        await sequelize.close();
    }
};

testLogin('admin@docky.com', 'admin123');
