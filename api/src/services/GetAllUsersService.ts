import { injectable } from "tsyringe";
import { User } from "../schemas/User";

@injectable()
export default class GetAllUsersService {
  async execute() {
    return await User.find().exec();
  }
}
