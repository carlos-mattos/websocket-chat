const socket = io("http://localhost:3000");

function onLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");
  const email = urlParams.get("email");
  const avatar = urlParams.get("avatar");

  console.log(name, email, avatar);

  socket.emit("start", {
    name,
    email,
    avatar,
  });
}

onLoad();
