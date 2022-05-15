import { container } from "tsyringe";
import { io } from "../http";
import { User } from "../schemas/User";
import CreateChatRoomService from "../services/CreateChatRoomService";
import CreateUserService from "../services/CreateUserService";
import GetAllUsersService from "../services/GetAllUsersService";
import GetUserBySocketIdService from "../services/GetUserBySocketIdService";
import GetChatRoomByUsersService from "../services/GetChatRoomByUsersService";
import CreateMessageService from "../services/CreateMessageService";
import GetMessageByChatRoomService from "../services/GetMessagesByChatRoomService";
import GetChatRoomByIdService from "../services/GetChatRoomByIdService";

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
    const getMessagesByChatRoomService = container.resolve(
      GetMessageByChatRoomService
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

    socket.join(room.id_chat_room);

    const messages = await getMessagesByChatRoomService.execute(
      room.id_chat_room
    );

    return callback({ room, messages });
  });

  socket.on("send_message", async (data) => {
    const getUserBySocketIdService = container.resolve(
      GetUserBySocketIdService
    );
    const createMessageService = container.resolve(CreateMessageService);
    const getChatRoomByIdService = container.resolve(GetChatRoomByIdService);

    const user = await getUserBySocketIdService.execute(socket.id);
    const message = await createMessageService.execute({
      to: user._id.toString(),
      text: data.message,
      roomId: data.idChatRoom,
    });
    const room = await getChatRoomByIdService.execute(data.idChatRoom);

    io.to(data.idChatRoom).emit("send_message", {
      message,
      user,
    });

    const userFrom = room.id_users.find(
      (response) => response._id.toString() != user._id.toString()
    );

    io.to(userFrom.socket_id).emit("notification", {
      newMessage: true,
      roomId: data.idChatRoom,
      from: user,
    });

    return;
  });
});
