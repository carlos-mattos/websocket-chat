import express from "express";
import http from "node:http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

server
  .listen(3000)
  .on("listening", () => console.log("Server is running on port 3000"));
