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
    getAllEventsForUser
} from "../controllers/events.controller.js";

router.get("/", getAllEvents);
router.get("/:email", getAllEventsForUser);
router.get("/:eventId", getEvent);
router.delete("/:eventId", deleteEvent);
router.post("/create", createEvent)
router.post("/userreg", registerUser)
router.get("/requests/:id", getAllRequests)
router.post("/approve", updateApprovalStatus)

export default router;
