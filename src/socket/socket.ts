import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import { Map, SocketEvents } from "../models/socketTypes";
import { Roles } from "../models/roomTypes";
import { CLIENT_URL } from "../consts/const";

dotenv.config();

const socket = require("socket.io");

// rooms map (key = roomName, value = code)
const rooms: Map = {};

// users map (key = socket.id, value = userRole)
const users: Map = {};

// users-rooms map (key = socket.id, value = roomName)
const usersRoomsMap: Map = {};

const connectToSocket = (server: Server) => {
  const io = socket(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on(SocketEvents.CONNECTION, (socket: Socket) => {
    // Join room event
    socket.on(SocketEvents.JOIN_ROOM, (roomName, initialCode, callback) => {
      // If joined the room first, add room to rooms map
      const isFirst = rooms[roomName] ? false : true;
      if (isFirst) {
        rooms[roomName] = initialCode;
      }

      // Join user to room
      socket.join(roomName);

      const reconnected = Object.keys(users).includes(socket.id);

      if (!reconnected) {
        // Add user to users map
        users[socket.id] = isFirst ? Roles.Mentor : Roles.Student;

        usersRoomsMap[socket.id] = roomName;

        // Notify all users in the room that a new user joined
        socket
          .to(roomName)
          .emit(
            SocketEvents.NEW_USER,
            io.sockets.adapter.rooms.get(roomName)?.size
          );

        // Send updated code and role to new user
        callback(
          rooms[roomName], // code
          users[socket.id], // role
          io.sockets.adapter.rooms.get(roomName)?.size // numParticipants
        );
      }
    });

    // Code modified event
    socket.on(SocketEvents.MODIFY_CODE, (roomName, code) => {
      rooms[roomName] = code;

      // Notify all users in the room that the code was modified
      socket.to(roomName).emit(SocketEvents.MODIFY_CODE, code);
    });

    // Leave room event
    socket.on(SocketEvents.DISCONNECT, () => {
      const role = users[socket.id];
      const roomName = usersRoomsMap[socket.id];

      // Remove user from users map
      delete users[socket.id];
      delete usersRoomsMap[socket.id];

      if (role === Roles.Mentor) {
        // Remove all users from room
        io.socket
          ?.clients(roomName)
          ?.forEach((user: any) => user.leave(roomName));

        // Redirect all users
        socket.to(roomName).emit(SocketEvents.REDIRECT);

        // Remove room from rooms map
        delete rooms[roomName];
      } else {
        // Notify all users in the room that the user left the room
        socket
          .to(roomName)
          .emit(
            SocketEvents.LEFT_ROOM,
            io.sockets.adapter.rooms.get(roomName)?.size
          );

        // Leave room
        socket.leave(roomName);
      }
    });
  });
};

export { connectToSocket };
