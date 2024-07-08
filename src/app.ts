import { json } from "body-parser";
import { roomsRouter } from "./routes/rooms";
import { connectToSocket } from "./socket/socket";
const path = require("path");
const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);

connectToSocket(server);
app.use(express.static(path.join(__dirname, "build")));

app.use(cors());
app.use(json());
app.use(roomsRouter);

app.get("*", (req: any, res: any) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

export { app, server as httpServer };

console.log("app.ts loaded");
