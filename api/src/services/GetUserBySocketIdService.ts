import { injectable } from "tsyringe";
import { User } from "../schemas/User";

@injectable()
export default class GetUserBySocketIdService {
  async execute(socketId: string) {
    return await User.findOne({ socket_id: socketId }).exec();
  }
}
