import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import cookieSession from "cookie-session";
import session from 'express-session';
import eventRoute from "./routes/events.js";
import userRoute from "./routes/users.routes.js";
import GoogleStrategy from 'passport-google-oauth20';
import { createEvent } from "./controllers/events.js";
dotenv.config();
import db from "./config/db.config.js";
import cookieParser from "cookie-parser";
db();
const app = express();

// supporting content types json, urlencoded for now
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(passport.initialize());
// app.use(passport.session());


app.use("/events/new", createEvent);
app.use("/events", eventRoute);
app.use("/user", userRoute);
app.listen(
  process.env.PORT ? process.env.PORT : 8080,
  process.env.HOST ? process.env.HOST : "127.0.0.1",
  console.log(
    `listening on http://localhost:${process.env.PORT ? process.env.PORT : 8080
    }/`
  )
);
