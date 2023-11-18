import { Events } from "../models/event.model.js";
import { User } from "../models/user.model.js";
import { Activity } from "../models/activity.model.js";
import { Attendance } from "../models/attendance.model.js";
import dotenv from "dotenv";
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { Approve } from "../models/approve.model.js";
dotenv.config();
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const s3 = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    },
});
export const createEvent = async (req, res) => {
    try {
        console.log(req.body)
        const {
            title,
            description,
            location,
            email,
            link,
            startDate,
            endDate,
            status,
            regDeadline,
            capacity,
            regFee,
        } = req.body;
        const randomImgName = (bytes = 16) =>
            crypto.randomBytes(bytes).toString("hex");
        const imgName = randomImgName();
        const params = {
            Bucket: bucketName,
            Key: imgName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };
        const command = new PutObjectCommand(params);
        const result = await s3.send(command);
        const adminUser = await User.findOne(email)
        // Create a new event document in the database
        const event = new Events({
            title,
            description,
            location,
            admin: adminUser._id,
            link,
            startDate,
            endDate,
            status,
            regDeadline,
            capacity,
            regFee,
            image: imgName,
        });

        await event.save();

        res.status(201).json({ event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
// Get all events
export const getAllEvents = async (req, res) => {
    try {
        const events = await Events.find();
        await Promise.all(
            events.map(async (event) => {
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: event.image,
                };
                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command, {
                    expiresIn: 3600,
                });
                event.url = url;
                return event;
            })
        );
        res.status(200).json({ events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const getAllEventsForUser = async (req, res) => {
    try {
        const email = req.params.email
        const currentUser = await User.findOne({email})
        const userId = currentUser._id
        const events = await Events.find();
        await Promise.all(
            events.map(async (event) => {
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: event.image,
                };
                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command, {
                    expiresIn: 3600,
                });
                event.url = url;
                return event;
            })
        );
        let returnObj = []
        for(let i=0 ; i<events.length ; i++){
            let event = events[i]
            let curObj = {
                event
            }
            const approval = await Approve.findOne({event:event._id,user:userId})
            console.log(approval)
            if(approval){
                curObj.status = approval.status
            }
            else{
                curObj.status = 'none'
            }
            console.log(curObj)
            returnObj.push(curObj)
            if(i===events.length-1){
                res.status(200).json(returnObj);
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Get a specific event by id
export const getEvent = async (req, res) => {
    const id = req.params.eventId;
    try {
        const event = await Events.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const activities = await Activity.find({ event: id });
        console.log(activities);
        const getObjectParams = {
            Bucket: bucketName,
            Key: event.image,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        event.url = url;
        res.status(200).json({ event, activities });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    const id = req.params.eventId;
    try {
        const event = await Events.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const params = {
            Bucket: bucketName,
            Key: event.image,
        };
        const command = new DeleteObjectCommand(params);
        await s3.send(command);
        await Events.findByIdAndRemove(id);
        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { userId, eventId } = req.body;

        const newApprove = new Approve({
            user: userId,
            event: eventId,
        });
        await newApprove.save();
        const currentEvent = await Events.findById(eventId);
        currentEvent.requests.push(newApprove._id);
        await currentEvent.save();
        return res.status(200).send(newApprove);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
};

export const getAllRequests = async (req, res) => {
    try {
        const eventId = req.params.id;
        const currentEvent = await Events.findById(eventId).populate({
            path: 'requests',
            populate: {
                path: 'user'
            }
        })
        // .exec(function(err,response){
        //     if(err){
        //         console.log(err)
        //         return res.status(500).send(err)
        //     }
        //     console.log(response)
        // })
        return res.status(200).json(currentEvent.requests);

        // let returnobj=[]
        // currentEvent.requests.forEach(element => {
        //     console.log(element)
        //     let curUser = await User.findById(element.user)
        //     console.log(curUser)
        //     let curobj = {
        //         status: element.status,
        //         user: curUser
        //     }
        //     returnobj.push(curobj)
        // });
        
    } catch (err) {
        console.log(err)
        return res.status(500).send(err);
    }
};

export const updateApprovalStatus = async (req, res) => {
    try {
        const { eventId, userId, newStatus } = req.body;

        // Find the approval with the given eventId and userId
        const approval = await Approve.findOne({ event: eventId, user: userId });

        if (!approval) {
            return res.status(404).json({ message: 'Approval not found' });
        }

        // Update the status field of the approval with the newStatus
        if(newStatus){
            approval.status = 'approved';
            const currentUser = await User.findById(userId);
            currentUser.registered.push(eventId);
            await currentUser.save();
        }
        else{
            approval.status = 'declined'
            const currentUser = await User.findById(userId);
            const ind = currentUser.registered.indexOf(eventId)
            if(ind!==-1){
                currentUser.registered.splice(ind,1)
                await currentUser.save();
            }
        }
        // Save the updated approval
        await approval.save();

        // Return the updated approval
        return res.json(approval);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};