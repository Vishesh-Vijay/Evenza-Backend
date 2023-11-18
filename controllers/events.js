import { Events } from "../models/event.model.js";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import { Activity } from "../models/activity.model.js";
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
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
        const {
            title,
            description,
            location,
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
        // Create a new event document in the database
        const event = new Events({
            title,
            description,
            location,
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
