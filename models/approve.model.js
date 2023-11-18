import mongoose from 'mongoose';

const { Schema } = mongoose;

const approveSchema = new Schema({
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
        enum: ['approved','pending','declined'],
        default: 'pending'
    },
});

export const Approve = mongoose.model("Approve", approveSchema);
