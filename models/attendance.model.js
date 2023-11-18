import mongoose from 'mongoose';

const { Schema } = mongoose;

const attendanceSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    activity: {
        type: Schema.Types.ObjectId,
        ref: 'Activity',
        required: true,
    },
});

export const Attendance = mongoose.model("Attendance", attendanceSchema);
