import express from "express";
const router = express.Router();

import {
    getEvent,
    getAllEvents,
    deleteEvent
} from "../controllers/events.js";
router.get("/", getAllEvents);
router.get("/:eventId", getEvent);
router.delete("/:eventId", deleteEvent);
export default router;