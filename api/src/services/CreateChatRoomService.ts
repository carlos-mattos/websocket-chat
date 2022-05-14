import { injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";

@injectable()
export default class CreateChatRoomService {
  async execute(idUsers: string[]) {
    const room = new ChatRoom({
      id_users: idUsers,
    });

    await room.save();

    return room;
  }
}
