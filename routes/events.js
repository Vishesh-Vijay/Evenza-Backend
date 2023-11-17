import express from "express";
const router = express.Router();

import {
    getAllEvents,
    getEvent,
    createEvent,
    deleteEvent,
    registerUser
    
} from "../controllers/events.js";

router.get("/", getAllEvents);
router.get("/:eventId", getEvent);
router.delete("/:eventId", deleteEvent);
router.post("/create", createEvent)
router.post("/userreg",registerUser)


export default router;
