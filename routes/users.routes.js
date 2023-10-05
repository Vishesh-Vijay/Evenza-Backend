import express from "express";
const router = express.Router();

import {
    signIn
} from "../controllers/user.js";
router.get("/signin", signIn);
export default router;