const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const lowerEmail = email.toLowerCase();

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email: lowerEmail } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create user (role defaults to 'user')
        const user = await User.create({
            name,
            email: lowerEmail,
            password // Hook will hash this
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const lowerEmail = email.toLowerCase();

        // Find user
        const user = await User.findOne({ where: { email: lowerEmail } });
        if (!user) {
            console.log(`User not found: ${lowerEmail}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.validPassword(password);
        if (!isMatch) {
            console.log(`Invalid password for: ${lowerEmail}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate Token
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        console.log(`Login successful: ${lowerEmail} (${user.role})`);

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
