import express from "express";
const router = express.Router();
import { updateAttendance,verifyAttendee } from "../controllers/attendance.controller.js";


// Route to update an existing attendance record
router.post('/:activityId', updateAttendance);
router.post('/verify/:id', verifyAttendee)

export default router;