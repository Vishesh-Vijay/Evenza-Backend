import express from "express";
const router = express.Router();

import {
    signIn
} from "../controllers/user.js";
router.get("/auth/google", signIn);
export default router;