const { Deadline } = require('../models');

// Get Deadline
exports.getDeadline = async (req, res) => {
    try {
        const deadline = await Deadline.findOne({ order: [['id', 'DESC']] });
        res.json(deadline);
    } catch (error) {
        console.error('Error fetching deadline:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update/Set Deadline
exports.updateDeadline = async (req, res) => {
    try {
        const { deadline } = req.body;
        if (!deadline) {
            return res.status(400).json({ message: 'Deadline is required' });
        }

        let currentDeadline = await Deadline.findOne({ order: [['id', 'DESC']] });

        if (currentDeadline) {
            currentDeadline.deadline = deadline;
            await currentDeadline.save();
        } else {
            currentDeadline = await Deadline.create({ deadline });
        }

        res.json({ message: 'Deadline updated successfully', deadline: currentDeadline });
    } catch (error) {
        console.error('Error updating deadline:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
