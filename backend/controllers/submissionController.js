const Submission = require('../models/Submission');
const User = require('../models/User');
const Deadline = require('../models/Deadline');
const { Op } = require('sequelize');

// Create Submission
exports.createSubmission = async (req, res) => {
    try {
        // Check Deadline
        const deadlineRecord = await Deadline.findOne({ order: [['id', 'DESC']] });
        if (deadlineRecord && new Date() > new Date(deadlineRecord.deadline)) {
            return res.status(403).json({ message: 'Submission deadline has passed' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { name, email } = req.body; // Can also take from req.user if preferred, but spec implies form might populate
        // Spec says "Submission Fields: name, email...". 
        // Usually these should match the logged in user, or be editable. 
        // Requirement says "After login, user can: View their name ... Submit document".
        // I will use req.user for reliability but allow override or fallback if intended?
        // Let's stick to req.user for the record, but maybe the form sends it.
        // I will use values from req.user to ensure data integrity with the logged-in account, 
        // unless the "name" and "email" in submission are meant to be different (e.g. submitting on behalf).
        // Spec: "User Name, Email" in Admin view.
        // I will prioritize req.user data for the submission record to link it correctly.

        const submission = await Submission.create({
            user_id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            file_name: req.file.originalname,
            file_path: req.file.path
        });

        res.status(201).json({ message: 'Submission successful', submission });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get User's Submissions
exports.getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.findAll({
            where: { user_id: req.user.id },
            order: [['created_at', 'DESC']]
        });
        res.json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Get All Submissions (with limits/filters)
exports.getAllSubmissions = async (req, res) => {
    try {
        const { search, date } = req.query;
        let whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (date) {
            // Assuming date is in YYYY-MM-DD format
            const startOfDay = new Date(date);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            whereClause.created_at = {
                [Op.between]: [startOfDay, endOfDay]
            };
        }

        const submissions = await Submission.findAll({
            where: whereClause,
            order: [['created_at', 'DESC']],
            include: [{ model: User, attributes: ['id', 'name', 'email'] }]
        });

        res.json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
