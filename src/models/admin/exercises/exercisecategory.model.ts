import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/database";
import Exercise from "./exercises.admin.model";
import Category from "../category/category.admin.model";

export const ExerciseCategory = sequelize.define(
  "exercisecategories",
  {
    exerciseId: {
      type: DataTypes.UUID,
      references: {
        model: Exercise,
        key: "id",
      },
      onDelete: "CASCADE", 
    },
    categoryId: {
      type: DataTypes.UUID,
      references: {
        model: Category,
        key: "id",
      },
      onDelete: "CASCADE", 
    },
  },
  { freezeTableName: true }
);


export default ExerciseCategory;
