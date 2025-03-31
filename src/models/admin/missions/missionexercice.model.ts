import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../config/database";
import { v4 as uuidv4 } from "uuid";

export const MissionExercise = sequelize.define(
  "missionexercise",
  {
    missionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Missions",
        key: "id",
      },
    },
    exerciseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Exercises",
        key: "id",
      },
    },
  },
  { freezeTableName: true }
);
