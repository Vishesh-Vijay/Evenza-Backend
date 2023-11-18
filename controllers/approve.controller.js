
// Import the necessary modules and dependencies

// Assuming you have a model called "Approval" for approvals
const Approval = require('../models/approval');

// Define the function that takes eventId, userId, and newStatus as parameters
const updateApprovalStatus = async (req, res) => {
    try {
        const { eventId, userId, newStatus } = req.body;

        // Find the approval with the given eventId and userId
        const approval = await Approval.findOne({ event: eventId, user: userId });

        if (!approval) {
            return res.status(404).json({ message: 'Approval not found' });
        }

        // Update the status field of the approval with the newStatus
        approval.status = newStatus;

        // Save the updated approval
        await approval.save();

        // Return the updated approval
        return res.json(approval);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Export the function
module.exports = { updateApprovalStatus };
