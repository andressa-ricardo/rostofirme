import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import { v4 as uuidv4 } from "uuid";
import User from "../user/user.model";
import { ProfileAttributes } from "../../@types/profile";

interface ProfileCreationAttributes extends Optional<ProfileAttributes, "id"> {}

class Profile
  extends Model<ProfileAttributes, ProfileCreationAttributes>
  implements ProfileAttributes
{
  public id!: string;
  public userId!: string;
  public bio!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Profile.init(
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
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Profile",
    tableName: "profiles",
    timestamps: true,
  }
);

export default Profile;
