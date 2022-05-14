import { container } from "tsyringe";
import { io } from "../http";
import { User } from "../schemas/User";
import CreateChatRoomService from "../services/CreateChatRoomService";
import CreateUserService from "../services/CreateUserService";
import GetAllUsersService from "../services/GetAllUsersService";
import GetUserBySocketIdService from "../services/GetUserBySocketIdService";
import {} from "mongoose";
import GetChatRoomByUsersService from "../services/GetChatRoomByUsersService";

interface IUserLoggedParams {
  email: string;
  avatar: string;
  name: string;
}

async function handleWithUserLogin(
  data: IUserLoggedParams & { socket_id: string }
): Promise<User> {
  const { email, avatar, name, socket_id } = data;

  const createUserService = container.resolve(CreateUserService);

  const user = await createUserService.execute({
    email,
    avatar,
    name,
    socket_id,
  });

  return user;
}

async function getUsersToList(email: string): Promise<User[]> {
  const getAllUsersService = container.resolve(GetAllUsersService);

  const allUsers = await getAllUsersService.execute();

  return allUsers.filter((user) => user.email !== email);
}

io.on("connect", (socket) => {
  socket.on("start", async (data) => {
    const user = await handleWithUserLogin({ ...data, socket_id: socket.id });
    socket.broadcast.emit("new_user", user);
    return;
  });

  socket.on("get_users", async (data, callback) => {
    const email = data.email;
    const allUsers = await getUsersToList(email);
    return callback(allUsers);
  });

  socket.on("start_chat", async (data, callback) => {
    const createChatRoomService = container.resolve(CreateChatRoomService);
    const getChatRoomByUsersService = container.resolve(
      GetChatRoomByUsersService
    );
    const getUserBySocketIdService = container.resolve(
      GetUserBySocketIdService
    );

    const userLogged = await getUserBySocketIdService.execute(socket.id);

    let room = await getChatRoomByUsersService.execute([
      userLogged._id.toString(),
      data.idUser,
    ]);

    if (!room) {
      room = await createChatRoomService.execute([
        userLogged._id.toString(),
        data.idUser,
      ]);
    }

    return callback(room);
  });
});
