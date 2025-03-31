import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../config/database";
import { MappingAttributes } from "../../../@types/admin/mapping";
import { v4 as uuidv4 } from "uuid";

interface MappingCreationAttributes extends Optional<MappingAttributes, "id"> {}

class Mapping
  extends Model<MappingAttributes, MappingCreationAttributes>
  implements MappingAttributes
{
  public id!: string;
  public question!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Mapping.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Mapping",
    tableName: "mappings",
    timestamps: true,
  }
);

export default Mapping;
