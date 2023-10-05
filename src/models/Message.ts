import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";
import ChatRoom from "./Chatroom";

interface MessageAttributes {
    id: typeof DataTypes.UUID,
    text: string;
}

interface MessageInstance extends Model<MessageAttributes>, MessageAttributes {}

const Message = sequelize.define<MessageInstance>("Message", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// One-to-many relationships
ChatRoom.hasMany(Message, {
    foreignKey: "chatroomId", 
    as: "messages",
});

export default Message;
