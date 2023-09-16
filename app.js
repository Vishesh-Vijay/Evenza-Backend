import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

// supporting content types json, urlencoded for now
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import db from "./config/db.config.js";
db();

app.listen(
  process.env.PORT ? process.env.PORT : 8080,
  process.env.HOST ? process.env.HOST : "127.0.0.1",
  console.log(
    `listening on http://localhost:${
      process.env.PORT ? process.env.PORT : 8080
    }/`
  )
);
