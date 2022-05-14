const socket = io("http://localhost:3000");

socket.on("welcome", (data) => {
  console.log(data);
});
