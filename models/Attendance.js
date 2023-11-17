import mongoose from 'mongoose';

const { Schema } = mongoose;

const attendanceSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Events',
        required: true,
    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        default: 'absent',
    },
});

export const Attendance = mongoose.model("Attendance", attendanceSchema);
