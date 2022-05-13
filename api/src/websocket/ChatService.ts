import { io } from "../http";

// socket - mais controle
// io - pra todos
io.on("connect", (socket) => {
  console.log("A user connected", socket.id);
  socket.emit("welcome", {
    message: "Seu chat foi iniciado",
  });
});

io.on("disconnect", (socket) => {
  console.log("A user DISconnect", socket.id);
});
