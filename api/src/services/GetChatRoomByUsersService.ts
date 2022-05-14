import { injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";

@injectable()
export default class GetChatRoomByUsersService {
  async execute(idUsers: string[]) {
    const room = await ChatRoom.findOne({ id_users: { $all: idUsers } }).exec();

    return room;
  }
}
