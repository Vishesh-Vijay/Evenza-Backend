import mongoose from "mongoose";

const attendeeSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	isApproved: {
		type: Boolean,
		default: false,
	},
});

const eventSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	location: { type: String, required: false },
	link: { type: String, required: false },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	attendees: [attendeeSchema], // Array of attendees with "isApproved" field
	regDeadline: { type: Date, required: false },
	capacity: { type: Number, required: false },
	image: {
		type: String,
		required: false,
	},
	url: {
		type: String,
		required: false,
	},
	regFee: { type: Number, required: true },
});

export const Events = mongoose.model("Events", eventSchema);
