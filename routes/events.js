import express from "express";
const router = express.Router();

import {
    getAllEvents,
    getEvent,
    deleteEvent,
} from "../controllers/events.js";

// Routes for Events
router.get("/", getAllEvents);
router.get("/:eventId", getEvent);
router.delete("/:eventId", deleteEvent);


export default router;
