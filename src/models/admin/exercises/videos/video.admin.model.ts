import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../../config/database";
import { v4 as uuidv4 } from "uuid";
import { VideoAttributes } from "../../../../@types/admin/video";
import Exercise from "../exercises.admin.model";

interface VideoCreationAttributes extends Optional<VideoAttributes, "id"> {}

class Video
  extends Model<VideoAttributes, VideoCreationAttributes>
  implements VideoAttributes
{
  public id!: string;
  public videoFile!: string;
  public videoThumbnail!: string;
  public videoDuration!: number;
  public exercise_id!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Video.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    videoFile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoThumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exercise_id: {
      type: DataTypes.UUID,
      references: {
        model: Exercise,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Video",
    tableName: "videos",
    timestamps: true,
  }
);

export default Video;
