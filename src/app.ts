import { json } from "body-parser";
import { roomsRouter } from "./routes/rooms";
import { connectToSocket } from "./socket/socket";
const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);

connectToSocket(server);

app.use(cors());
app.use(json());
app.use(roomsRouter);

export { app, server as httpServer };

console.log("app.ts loaded");
