import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // googleId: {
    //     type: String,
    //     required: true,
    //     unique: true,
    // },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: false,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const User = mongoose.model("User", userSchema);
