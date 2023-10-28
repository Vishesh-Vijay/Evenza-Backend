const express = require('express');
const router = express.Router();
import { updateAttendance } from "../controllers/attendance.controller.js";


// Route to update an existing attendance record
router.post('/:activityId', updateAttendance);


module.exports = router;
