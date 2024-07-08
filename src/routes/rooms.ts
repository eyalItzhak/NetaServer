import express from "express";
import { Room } from "../models/roomTypes";

const router = express.Router();

// Create a new room
router.post("/api/rooms", async (req, res) => {
  const { title, description, initialCode, solution } = req.body;

  const room = Room.build({ title, description, initialCode, solution });
  const data = await room.save();
  res.send(data);
});

// Get all rooms
router.get("/api/rooms", async (_req, res) => {
  const rooms = await Room.find({});
  res.send(rooms);
});

// Get specific room
router.get("/api/rooms/:id", async (req, res) => {
  const id = req.params.id;
  const room = await Room.findById(id);
  res.send(room);
});

// Delete all rooms (for tests)
router.delete("/api/rooms", async (_req, res) => {
  await Room.deleteMany({});
  res.send();
});

export { router as roomsRouter };
