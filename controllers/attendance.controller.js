import { User } from "../models/User.js";
import { Attendance } from "../models/Attendance.js";
import { encryptObject, decryptObject } from '../utils/venky.js';

export const updateAttendance = async (req, res) => {

    try {
        const {
            qr,
            activityId
        } = req.body;
        const detailsObject = await decryptObject(qr);
        const {
            email
        } = detailsObject;

        const user = await User.findOne({ email });
        const attendance = await Attendance.findOne({ user: user._id, activity: activityId });
        if (attendance) {
            await Attendance.findByIdAndUpdate(attendance._id, { status: 'present' });
            res.status(200).json({ message: 'Attendance updated successfully' });
        }
        else {
            const newAttendance = new Attendance({
                user: user._id,
                activity: activityId,
                status: 'present'
            });
            await newAttendance.save();
            res.status(200).json({ message: 'Attendance updated successfully' });
        }


    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
