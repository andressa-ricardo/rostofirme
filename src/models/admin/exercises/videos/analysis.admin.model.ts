import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../../config/database";
import { v4 as uuidv4 } from "uuid";
import Video from "./video.admin.model";
import { VideoAnalysisAttributes } from "../../../../@types/admin/analysis";

interface VideoAnalysisCreationAttributes
  extends Optional<VideoAnalysisAttributes, "id"> {}

class VideoAnalysis
  extends Model<VideoAnalysisAttributes, VideoAnalysisCreationAttributes>
  implements VideoAnalysisAttributes
{
  public id!: string;
  public videoId!: string;
  public motionData!: string;
  public facialExpressions!: string;
  public keypoints!: string;
  public durationAnalyzed!: number;
  public analysisStatus!: "pending" | "in_progress" | "completed";

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

VideoAnalysis.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
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
    motionData: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    facialExpressions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    keypoints: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    durationAnalyzed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    analysisStatus: {
      type: DataTypes.ENUM("pending", "in_progress", "completed"),
      defaultValue: "pending",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "VideoAnalysis",
    tableName: "video_analyses",
    timestamps: true,
  }
);

export default VideoAnalysis;
