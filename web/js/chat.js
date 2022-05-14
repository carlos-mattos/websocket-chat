const socket = io("http://localhost:3000");
let roomId = "";

function onLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");
  const email = urlParams.get("email");
  const avatar = urlParams.get("avatar");

  document.querySelector(".user_logged").innerHTML += `
    <img class="avatar_user_logged" src="${avatar}" alt="user avatar" />
    <strong id="user_logged">
      ${name}
    </strong>
  `;

  socket.emit("start", {
    name,
    email,
    avatar,
  });

  socket.on("new_user", (data) => {
    const existsInDiv = document.getElementById(`user_${data._id}`);
    if (!existsInDiv && data.email !== email) addUser(data);
  });

  socket.emit("get_users", { email }, (users) => {
    users.forEach((user) => addUser(user));
  });
}

function addUser(user) {
  const usersList = document.getElementById("users_list");
  usersList.innerHTML += `
  <li class="user_name_list" id="user_${user._id}" idUser="${user._id}">
    <img class="nav_avatar" src="${user.avatar}" alt="profile picture of user in list"/>
    ${user.name}
  </li>
  `;
}

document.getElementById("users_list").addEventListener("click", (event) => {
  if (event.target && event.target.matches("li.user_name_list")) {
    const idUser = event.target.getAttribute("idUser");
    socket.emit("start_chat", { idUser }, (data) => {
      roomId = data.id_chat_room;
    });
  }
});

onLoad();
