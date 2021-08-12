import express from "express";
import * as http from "http";

import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import { CommonRoutesConfig } from "./routes/config";
import { CommonRoutes } from "./routes/common.route";
import debug from "debug";
import mongoose from "mongoose";

import { RedisClient } from "redis";

import todoModel from "./model/todoModel";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 8000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug("app");

var redisClient: RedisClient = new RedisClient({
  port: 6379,
  host: "cache.kazam.in",
  password:
    "Adj+4U9M2mYg3jTbF+v/lV7Ov+JYerzjhKqvPqkSGyXQ+GMsx8jklf4DCw7KMt6OO0U7VXS4jGe4gM5w",
});

app.use(express.json());
app.use(cors());

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint()
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false;
}

mongoose.connect(
  "mongodb+srv://backendtask:X5TZb7bEObBs4i7p@origin.b0qxt.mongodb.net/backend_tasks_Arijeet",
  { useNewUrlParser: true }
);
var db = mongoose.connection;

db.on("error", (err) => console.log(err));

app.use(expressWinston.logger(loggerOptions));

routes.push(new CommonRoutes(app));

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

var messages: Array<string> = [];

io.on("connection", function (socket: any) {
  console.log("a user connected");

  socket.on("add", function (message: string) {
    console.log(message);
    messages.push(message);
    if (messages && messages.length < 4) {
      redisClient.set("BACKEND_TASK_ARIJEET", JSON.stringify(messages));
    } else {
      redisClient.del("BACKEND_TASK_ARIJEET");
      messages.forEach(async (item: string) => {
        try {
          const newTask = new todoModel({
            task: item,
          });
          await newTask.save();
          console.log("added to db");
        } catch (error) {
          console.log(error);
        }
      });
      messages = [];
    }
  });
});
server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
});
