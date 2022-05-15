import { injectable } from "tsyringe";
import { Message } from "../schemas/Message";

interface CreateMessageDTO {
  to: string;
  text: string;
  roomId: string;
}

@injectable()
export default class CreateMessageService {
  async execute({ roomId, text, to }: CreateMessageDTO) {
    const message = new Message({
      room_id: roomId,
      text,
      to,
    });

    await message.save();

    return message;
  }
}
