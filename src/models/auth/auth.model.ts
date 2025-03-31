import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import { v4 as uuidv4 } from "uuid";
import User from "../user/user.model";
import { AuthAttributes } from "../../@types/auth";

interface AuthCreationAttributes extends Optional<AuthAttributes, "id"> {}

class Auth
  extends Model<AuthAttributes, AuthCreationAttributes>
  implements AuthAttributes
{
  public id!: string;
  public userId!: string;
  public token!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Auth.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Auth",
    tableName: "auth_tokens",
    timestamps: true,
  }
);

export default Auth;
