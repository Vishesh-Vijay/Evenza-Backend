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
        type: Boolean,
        default: false,
    },
});

export const Approve = mongoose.model("Approve", approveSchema);
