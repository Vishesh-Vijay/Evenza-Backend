import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import {
    // signIn,
    LogIn,
    Register,
    GetAllUsers,
    getUserDetailsById,
} from "../controllers/user.js";
import { authenticateToken } from "../middlewares/auth.js";

// router.get("/signin", signIn);
router.post("/register", Register);
router.post("/login", LogIn);
router.get("/", GetAllUsers);
router.get("/:userId", getUserDetailsById);
router.get("/:authenticateToken", authenticateToken, (req, res) => {
    // The user data from the token is available in req.user
    res.json({ user: req.user });
});
export default router;
