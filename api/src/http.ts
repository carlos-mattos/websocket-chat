import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import path from "node:path";

const app = express();

const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "..", "..", "web")));

const io = new Server(server);

export { server, io };
