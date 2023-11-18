// import { User } from "../models/User.js";
// import { Attendance } from "../models/Attendance.js";
import { encryptObject, decryptObject } from '../utils/venky.js';
import { User } from "../models/User.js";
import { Attendance } from "../models/Attendance.js";
// import { decryptObject } from '../utils/venky.js';


export const updateAttendance = async (req, res) => {
    try {
        const { qr, activityId } = req.body;
        const detailsObject = await decryptObject(qr);
        const { email, password } = detailsObject;

        const user = await User.findOne({ email });
        const attendance = await Attendance.findOne({ user: user._id, activity: activityId });

        if (attendance) {
            if (attendance.status === 'present') {
                res.status(200).json({ message: 'Attendance already marked' });
            } else {
                await Attendance.findByIdAndUpdate(attendance._id, { status: 'present' });
                await User.findByIdAndUpdate(user._id, { $push: { attended: activityId }, $inc: { attendedCount: 1 } });
                const attendedCount = user.attended.length + 1;
                const registeredCount = user.registered.length;
                await User.findByIdAndUpdate(user._id, { attendedCount, registeredCount });
                res.status(200).json({ message: 'Attendance updated successfully' });
            }
        } else {
            const newAttendance = new Attendance({
                user: user._id,
                activity: activityId,
                status: 'present'
            });
            await newAttendance.save();
            await User.findByIdAndUpdate(user._id, { $push: { attended: activityId }, $inc: { attendedCount: 1 } });
            const attendedCount = user.attended.length + 1;
            const registeredCount = user.registered.length;
            await User.findByIdAndUpdate(user._id, { attendedCount, registeredCount });
            res.status(200).json({ message: 'Attendance marked successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


