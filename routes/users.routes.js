import express from "express";
const router = express.Router();

import {
    // signIn,
    LogIn,
    Register,
    GetAllUsers
} from "../controllers/user.js";
// router.get("/signin", signIn);
router.post("/register", Register);
router.post("/login", LogIn);
router.get("/", GetAllUsers);

export default router;