import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import { v4 as uuidv4 } from "uuid";
import User from "../user/user.model";
import Exercise from "../admin/exercises/exercises.admin.model";
import { ActivityAttributes } from "../../@types/activity";

interface ActivityCreationAttributes
  extends Optional<ActivityAttributes, "id"> {}

class Activity
  extends Model<ActivityAttributes, ActivityCreationAttributes>
  implements ActivityAttributes
{
  public id!: string;
  public userId!: string;
  public exerciseId!: string;
  public videoWatched!: boolean;
  public date!: Date;
  public exerciseCompleted!: boolean;
  public performanceScore!: number;
  public timeSpent!: number;
  public progressNotes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Activity.init(
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
    exerciseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Exercise,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    videoWatched: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    exerciseCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    performanceScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    timeSpent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    progressNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Activity",
    tableName: "activities",
    timestamps: true,
  }
);

export default Activity;
