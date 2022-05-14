import { container } from "tsyringe";
import { io } from "../http";
import { User } from "../schemas/User";
import CreateUserService from "../services/CreateUserService";
import GetAllUsersService from "../services/GetAllUsersService";

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
    callback(allUsers);

    return;
  });
});
