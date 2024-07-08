import mongoose from "mongoose";
import { httpServer } from "./app";
import dotenv from "dotenv";

dotenv.config();
const { DB_CONN_STRING, SERVER_PORT } = process.env;

const bootstrap = async () => {
  await mongoose
    .connect(DB_CONN_STRING as string)
    .then(() => console.log("Connected to MongoDB"))
    .catch((reason: any) => console.log("error", reason));
  httpServer.listen(SERVER_PORT, () => {
    console.log(`Listening on port ${SERVER_PORT}`);
  });
};

bootstrap();
