console.log('Server starting...');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/authRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const settingRoutes = require('./routes/settingRoutes');
const User = require('./models/User');
const Submission = require('./models/Submission');
const bcrypt = require('bcryptjs');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/settings', settingRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Seed Admin
const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@docky.com';
        const adminExists = await User.findOne({ where: { email: adminEmail } });

        if (!adminExists) {
            // Password hashing is handled by the hook in User model model, 
            // BUT hooks only run on create/update instances, usually safe to trust create.
            // However, let's just pass the raw password and let the hook do it.
            await User.create({
                name: 'Admin',
                email: adminEmail,
                password: 'admin123',
                role: 'admin'
            });
            console.log('Admin account created: admin@docky.com / admin123');
        } else {
            console.log('Admin account already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

// Database Connection and Server Start
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync models
        await sequelize.sync({ alter: true }); // Usage of alter to match schema updates if any without dropping data

        // Seed Admin
        await seedAdmin();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
