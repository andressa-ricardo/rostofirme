import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";
import User from "../user/user.model";

export class ChatMessage extends Model {
  public id!: string;
  public userId!: string;
  public content!: string;
  public isFromSupport!: boolean;
  public isRead!: boolean;
}

ChatMessage.init(
  {
    id: { 
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true 
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    content: { type: DataTypes.TEXT, allowNull: false },
    isFromSupport: { type: DataTypes.BOOLEAN, defaultValue: false },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize, modelName: "ChatMessage", tableName: "chat_messages" }
);

User.hasMany(ChatMessage, { foreignKey: "userId" });
ChatMessage.belongsTo(User, { foreignKey: "userId" });

export default ChatMessage;
