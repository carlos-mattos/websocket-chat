import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import path from "node:path";

const app = express();

const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "..", "..", "web")));

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Socket", socket);
});

server
  .listen(3000)
  .on("listening", () => console.log("Server is running on port 3000"));
