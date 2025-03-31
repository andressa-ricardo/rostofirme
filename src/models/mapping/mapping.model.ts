import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import { v4 as uuidv4 } from "uuid";
import User from "../user/user.model";
import Mapping from "../admin/mapping/mapping.admin.model";
import { MappingResponseAttributes } from "../../@types/mapping";

interface MappingResponseCreationAttributes
  extends Optional<MappingResponseAttributes, "id"> {}

class MappingResponse
  extends Model<MappingResponseAttributes, MappingResponseCreationAttributes>
  implements MappingResponseAttributes
{
  public id!: string;
  public userId!: string;
  public mappingId!: string;
  public rating!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MappingResponse.init(
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
    mappingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Mapping,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    sequelize,
    modelName: "MappingResponse",
    tableName: "mapping_responses",
    timestamps: true,
  }
);

User.hasMany(MappingResponse, {
  foreignKey: "userId",
  as: "responses",
});

Mapping.hasMany(MappingResponse, {
  foreignKey: "mappingId",
  as: "responses",
});

MappingResponse.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

MappingResponse.belongsTo(Mapping, {
  foreignKey: "mappingId",
  as: "mapping",
});

export default MappingResponse;
