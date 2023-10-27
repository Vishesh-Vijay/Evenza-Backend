import { Events } from "../models/event.model.js";
import dotenv from "dotenv";
import { User } from "../models/User.js";
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
        res.status(200).json({ events });
    } catch (error) {
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
        res.status(200).json({ event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    const id = req.params.eventId;
    try {
        const event = await Events.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
