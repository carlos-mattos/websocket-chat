import { injectable } from "tsyringe";
import { Message } from "../schemas/Message";

@injectable()
export default class GetMessageByChatRoomService {
  async execute(roomId: string) {
    const messages = await Message.find({ room_id: roomId })
      .populate("to")
      .exec();

    return messages;
  }
}
