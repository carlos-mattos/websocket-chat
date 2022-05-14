import { injectable } from "tsyringe";
import { User } from "../schemas/User";

interface CreateUserDTO {
  email: string;
  name: string;
  socket_id: string;
  avatar: string;
}

@injectable()
export default class CreateUserService {
  async execute({ avatar, email, name, socket_id }: CreateUserDTO) {
    const userAlreadyExists = await User.findOne({ email }).exec();

    if (userAlreadyExists) {
      const user = await User.findOneAndUpdate(
        { _id: userAlreadyExists._id },
        { $set: { socket_id, avatar, name } },
        { new: true }
      );

      return user;
    }

    const user = await User.create({
      email,
      socket_id,
      name,
      avatar,
    });

    await user.save();

    return user;
  }
}
