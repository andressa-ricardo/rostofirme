import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../config/database";
import { v4 as uuidv4 } from "uuid";
import { PrivacyPolicyAttributes } from "../../../@types/admin/privacy";

interface PrivacyPolicyCreationAttributes
  extends Optional<PrivacyPolicyAttributes, "id"> {}

class PrivacyPolicy
  extends Model<PrivacyPolicyAttributes, PrivacyPolicyCreationAttributes>
  implements PrivacyPolicyAttributes
{
  public id!: string;
  public policy!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PrivacyPolicy.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    policy: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "PrivacyPolicy",
    tableName: "privacy_policies",
    timestamps: true,
  }
);

export default PrivacyPolicy;
