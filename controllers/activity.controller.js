import { Activity } from "../models/activity.model.js";
import { Attendance } from "../models/attendance.model.js";
import { Events } from "../models/event.model.js";
import { User } from "../models/user.model.js";

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
            event,
        } = req.body.formData;

        if (!title || !description || !startDate || !endDate || !event) {
            return res
                .status(400)
                .send("Required fields to create activity not present");
        }

        const currentEvent = await Events.findById(event);

        if (!currentEvent) {
            return res.status(400).send("Corresponding event does not exist");
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
            event,
        });

        await newActivity.save();
        currentEvent.activities.push(newActivity._id);
        await currentEvent.save();
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

export const setPhysicalAttendance = async (req, res) => {
    try {
        const { activityId, userEmail, userScanEmail } = req.body;
        const currentActivity = await Activity.findById(activityId);
        if (!currentActivity) {
            return res
                .status(400)
                .send({ errMess: "Corresponding activity does not exist" });
        }
        const currentUser = await User.findOne({ email: userEmail });
        if (!currentUser) {
            return res
                .status(400)
                .send({ errMess: "Corresponding user does not exist" });
        }
        const eventId = currentActivity.event;
        const currentEvent = await Events.findById(eventId);
        if (!currentEvent) {
            return res
                .status(400)
                .send({ errMess: "Corresponding event does not exist" });
        }
        console.log(currentEvent);
        const userScan = await User.findOne({ email: userScanEmail });
        console.log(userScan);
        const userScanId = userScan._id;
        // Check this
        // if(userScanId!=currentActivity.admin && userScanId!=currentEvent.admin){
        //     return res.status(400).send("Scanning person is not the admin")
        // }
        const currentAttendance = await Attendance.find({
            user: currentUser._id,
            activity: activityId,
        });
        if (currentAttendance) {
            return res
                .status(400)
                .send({ errMess: "User has already attended the activity" });
        }
        if (
            currentActivity.startDate < Date.now() &&
            currentActivity.endDate > Date.now()
        ) {
            const newAttendee = new Attendance({
                user: currentUser._id,
                activity: activityId,
            });
            await newAttendee.save();
        } else {
            res.status(400).send({
                errMess: "Activity timeline is not followed",
            });
        }
        return res.status(201).json(newAttendee);
    } catch (err) {
        return res.status(500).send(err);
    }
};

export const getPhysicalAttendees = async (req, res) => {
    try {
        const activityId = req.params.activityId;
        const attendees = await Attendance.find({ activity: activityId });
        console.log(attendees);
        let finalArr = [];
        for (let i = 0; i < attendees.length; i++) {
            const curUser = await User.findById(attendees[i].user);
            // console.log(curUser)
            finalArr.push(curUser);
        }
        // const finalObj = await attendees.populate('user')
        res.status(200).send(finalArr);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
};
