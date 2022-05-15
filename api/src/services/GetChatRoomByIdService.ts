import { injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";

@injectable()
export default class GetChatRoomByIdService {
  async execute(idChatRoom: string) {
    const room = await ChatRoom.findOne({ id_chat_room: idChatRoom })
      .populate("id_users")
      .exec();

    return room;
  }
}
