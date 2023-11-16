import express from "express";
const router = express.Router();

import {
    getAllEvents,
    getEvent,
    deleteEvent,
    createEvent
} from "../controllers/events.js";

router.get("/", getAllEvents);
router.get("/:eventId", getEvent);
router.delete("/:eventId", deleteEvent);
router.post("/create", createEvent)

export default router;
