import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../../config/database';
import { v4 as uuidv4 } from 'uuid';
import Exercise from '../exercises/exercises.admin.model';
import Category from '../category/category.admin.model';
import { MissionAttributes } from '../../../@types/admin/missions';

interface MissionCreationAttributes extends Optional<MissionAttributes, 'id'> {}

class Mission extends Model<MissionAttributes, MissionCreationAttributes> implements MissionAttributes {
  setCategories(existingCategories: Category[]) {
    throw new Error("Method not implemented.");
  }
  setExercises(existingExercises: Exercise[]) {
    throw new Error("Method not implemented.");
  }
  async addExercises(exercises: Exercise[]) {
    await (this as any).setExercises(exercises);
  }
  
  async addCategories(categories: Category[]) {
    await (this as any).setCategories(categories);
  }
  
  public id!: string;
  public title!: string;
  public description!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Mission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Mission',
    tableName: 'missions',
    timestamps: true,
  }
);

export default Mission;
