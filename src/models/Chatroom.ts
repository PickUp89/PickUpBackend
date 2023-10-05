import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";
import User from './User'; 

interface ChatRoomAttributes {
    id: typeof DataTypes.UUID;
    name: string;
    creation_date: Date;
}

interface ChatRoomInstance extends Model<ChatRoomAttributes>, ChatRoomAttributes {}

const ChatRoom = sequelize.define<ChatRoomInstance>("ChatRoom", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        defaultValue: "Chat",
        allowNull: false,
    },
    creation_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
});

// Relationship
// Chatroom has one owner (1:1)
// Owner has many chatroom (1:n)
// Chatroom has many participants and participants has many chatroom (n:n)

// One-to-one relationship with the User instance
ChatRoom.belongsTo(User, {
    foreignKey: "ownerId",
    as: "owner",
})

export default ChatRoom;





