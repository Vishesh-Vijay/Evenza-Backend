import express from "express";
const router = express.Router();

import {
    createActivity, getActivity, getAllActivities, deleteActivity
} from "../controllers/activity.controller.js";

// Routes for Activities
router.get("/", getAllActivities);
router.get("/:activityId", getActivity);
router.post("/new", createActivity);
router.delete("/:activityId", deleteActivity);


export default router;
