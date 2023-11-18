import { Activity } from "../models/activity.model.js";
import { Events } from "../models/event.model.js";

export const createActivity = async (req, res) => {
    try {
        const {
            title,
            description,
            startDate,
            endDate,
            location,
            link,
            capacity,
            image,
            url,
            event
        } = req.body;

        if (!title || !description || !startDate || !endDate || !event) {
            return res.status(400).send("Required fields to create activity not present")
        }

        const currentEvent = await Events.findById(event);

        if (!currentEvent) {
            return res.status(400).send("Corresponding event does not exist")
        }

        // Create a new event document in the database
        const newActivity = new Activity({
            title,
            description,
            startDate,
            location,
            link,
            endDate,
            capacity,
            image,
            url,
            event
        });

        await newActivity.save();

        res.status(201).json({ newActivity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
// Get all events
export const getAllActivities = async (req, res) => {
    try {
        const allActivities = await Activity.find();
        res.status(200).json({ allActivities });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific event by id
export const getActivity = async (req, res) => {
    const id = req.params.activityId;
    try {
        const currentActivity = await Activity.findById(id);
        if (!currentActivity) {
            return res.status(404).json({ message: "Activity not found" });
        }
        res.status(200).json({ currentActivity });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteActivity = async (req, res) => {
    const id = req.params.activityId;
    try {
        const deletedActivity = await Activity.findByIdAndDelete(id);
        if (!deletedActivity) {
            return res.status(404).json({ message: "No such activity exists" });
        }
        res.status(200).json({ deletedActivity });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

