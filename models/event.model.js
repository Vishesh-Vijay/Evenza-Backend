import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	location: { type: String, required: false },
	admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
		required: true
    },
	link: { type: String, required: false },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	requests: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: "Approve",
		// Array of attendees with "isApproved" field
	}, 
	activities: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: "Activity",
		// Array of attendees with "isApproved" field
	}, 
	regDeadline: { type: Date, required: false },
	capacity: { type: Number, required: false },
	image: {
		type: String,
		required: true,
	},
	url: {
		type: String,
		required: false,
	},
	regFee: { type: Number, required: true },
});

export const Events = mongoose.model("Events", eventSchema);
