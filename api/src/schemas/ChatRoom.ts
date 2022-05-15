import mongoose, { Document, Schema } from "mongoose";
import { User } from "./User";
import { v4 as uuid } from "uuid";

type ChatRoom = Document & {
  id_users: User[];
  id_chat_room: string;
};

const ChatRoomSchema = new Schema({
  id_users: {
    type: [String],
    ref: "Users",
  },
  id_chat_room: {
    type: String,
    default: uuid(),
  },
});

const ChatRoom = mongoose.model<ChatRoom>("ChatRooms", ChatRoomSchema);

export { ChatRoom };
