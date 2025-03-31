import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import { v4 as uuidv4 } from "uuid";
import User from "../user/user.model";
import Video from "../admin/exercises/videos/video.admin.model";
import { MySavesAttributes } from "../../@types/mysaves";

interface MySavesCreationAttributes extends Optional<MySavesAttributes, "id"> {}

class MySaves
  extends Model<MySavesAttributes, MySavesCreationAttributes>
  implements MySavesAttributes
{
  public id!: string;
  public userId!: string;
  public videoId!: string;
  public isSaved!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MySaves.init(
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
    videoId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Video,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    isSaved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "MySaves",
    tableName: "my_saves",
    timestamps: true,
  }
);

export default MySaves;
