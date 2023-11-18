import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import cookieSession from "cookie-session";
import session from "express-session";
import eventRoute from "./routes/events.routes.js";
import userRoute from "./routes/users.routes.js";
import activityRoute from "./routes/activity.routes.js";
import GoogleStrategy from "passport-google-oauth20";
import { createEvent } from "./controllers/events.controller.js";
import attendanceRoute from "./routes/attendance.routes.js";
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
// import { createEvent } from "./controllers/events.js";
dotenv.config();
import db from "./config/db.config.js";
import cookieParser from "cookie-parser";
db();
const app = express();

// supporting content types json, urlencoded for now
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));
const storage = multer.memoryStorage();
const upload = multer({ storage });

// app.use(passport.initialize());
// app.use(passport.session());
app.use("/attendance", attendanceRoute);
// app.use("/events/new", createEvent);
app.use("/events/new", upload.single("image"), createEvent);
app.use("/events", eventRoute);
app.use("/user", userRoute);
app.use("/activity", activityRoute);
app.listen(
    process.env.PORT ? process.env.PORT : 8080,
    process.env.HOST ? process.env.HOST : "0.0.0.0",
    console.log(`App is now live!`)
);
