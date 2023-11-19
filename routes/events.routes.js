import express from "express";
const router = express.Router();

import {
    getAllEvents,
    getEvent,
    createEvent,
    deleteEvent,
    registerUser,
    getAllRequests,
    updateApprovalStatus,
    getAllEventsForUser,
    getAllActivities
} from "../controllers/events.controller.js";

router.get("/", getAllEvents);
router.get("/:email", getAllEventsForUser);
router.get("/id/:eventId", getEvent);
router.get("/requests/:id", getAllRequests)
router.get("/activities/:eventId", getAllActivities)
router.post("/create", createEvent)
router.post("/userreg", registerUser)
router.post("/approve", updateApprovalStatus)
router.delete("/:eventId", deleteEvent);

export default router;
