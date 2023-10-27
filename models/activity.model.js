import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Events",
    },
    description: { type: String, required: true },
    location: { type: String, required: false },
    link: { type: String, required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    capacity: { type: Number, required: false },
    image: { type: String, required: false },
    url: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

export const Activity = mongoose.model("Activity", activitySchema);
