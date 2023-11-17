import express from "express";
const router = express.Router();

import {
    getAllEvents,
    getEvent,
    createEvent,
    deleteEvent,
    registerUser,
    getAllAttendees
} from "../controllers/events.js";

router.get("/", getAllEvents);
router.get("/:eventId", getEvent);
router.delete("/:eventId", deleteEvent);
router.post("/create", createEvent)
router.post("/userreg",registerUser)
router.get("/attendees/:id",getAllAttendees)


export default router;
