import express from "express";
const router = express.Router();

import {
    createActivity, getActivity, getAllActivities, deleteActivity ,getPhysicalAttendees, setPhysicalAttendance
} from "../controllers/activity.controller.js";

// Routes for Activities
router.get("/", getAllActivities);
router.get("/attendees/:activityId",getPhysicalAttendees)
router.get("/:activityId", getActivity);
router.post("/new", createActivity);
router.post("/attend",setPhysicalAttendance)
router.delete("/:activityId", deleteActivity);


export default router;
