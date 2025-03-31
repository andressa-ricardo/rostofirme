import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../config/database";
import { v4 as uuidv4 } from "uuid";

export const MissionCategory = sequelize.define(
  "missioncategory",
  {
    missionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Missions",
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Categories",
        key: "id",
      },
    },
  },
  { freezeTableName: true }
);
