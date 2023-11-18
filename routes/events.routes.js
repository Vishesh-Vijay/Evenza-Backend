import express from "express";
const router = express.Router();

import {
    getAllEvents,
    getEvent,
    createEvent,
    deleteEvent,
    registerUser,
    getAllRequests
} from "../controllers/events.controller.js";

router.get("/", getAllEvents);
router.get("/:eventId", getEvent);
router.delete("/:eventId", deleteEvent);
router.post("/create", createEvent)
router.post("/userreg", registerUser)
router.get("/requests/:id", getAllRequests)


export default router;
