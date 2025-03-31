import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import { v4 as uuidv4 } from "uuid";
import { UserAttributes } from "../../@types/user";
import bcrypt from "bcrypt";

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "pushToken"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public age!: number;
  public email!: string;
  public password!: string;
  public avatar!: string;
  public pushToken!: string | null;
  public activated!: boolean;
  public role!: "administrator" | "client";

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async isPasswordValid(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password || "");
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pushToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    activated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("administrator", "client"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password") && user.password) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
        }
      },
    },
  }
);

export default User;
