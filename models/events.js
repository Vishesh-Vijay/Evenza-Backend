import {model , Schema} from "mongoose"

const eventSchema = new Schema(
    {
	name: {type: String , required: true,},
	description: {type: String , required: true,},
	location: {type: String , requried: false,},
	link: {type: String , required: false,},
	startDate: {type: Date , required: true,},
	endDate: {type : Date , required: true,},
	attendees:[
	    {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	    },
	],
	status: {type: String , required: true,},
	regDeadline: {type: Date , required: false,},
	capacity: {type: Number , required: true,},
	regFee: {type : Number , required: true,},
    }
);

export const eventModel = mongoose.model("Event" , eventSchema);
