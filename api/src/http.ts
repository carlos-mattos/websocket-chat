import "reflect-metadata";
import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import path from "node:path";
import mongoose from "mongoose";

const app = express();

const server = http.createServer(app);

startMongoConnection().catch((err) => console.log(err));

async function startMongoConnection() {
  await mongoose.connect("mongodb://localhost/myChat");
}

app.use(express.static(path.join(__dirname, "..", "..", "web")));

const io = new Server(server);

export { server, io };
