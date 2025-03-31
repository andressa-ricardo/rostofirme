import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../config/database";
import { v4 as uuidv4 } from "uuid";
import Video from "./videos/video.admin.model";
import { ExerciseAttributes } from "../../../@types/admin/exercises";
import Category from "../category/category.admin.model";

interface ExerciseCreationAttributes
  extends Optional<ExerciseAttributes, "id"> {}

class Exercise
  extends Model<ExerciseAttributes, ExerciseCreationAttributes>
  implements ExerciseAttributes
{
  public id: string | undefined;
  public title: string | undefined;
  public description: string | undefined;
  public videoId: string | undefined;
  public pdfFile: string | undefined;
  public exampleImage1: string | undefined;
  public exampleImage2: string | undefined;
  public videoDuration: number | undefined;
  public exerciseDuration: number | undefined;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Exercise.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      // allowNull: false,
    },
    videoId: {
      type: DataTypes.UUID,
      references: {
        model: Video,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    pdfFile: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    exampleImage1: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    exampleImage2: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    videoDuration: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    exerciseDuration: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Exercise",
    tableName: "exercises",
    timestamps: true,
  }
);

export default Exercise;
