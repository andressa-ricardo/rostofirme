import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import { CodeValidationAttributes } from '../../@types/code';

class CodeValidation extends Model<CodeValidationAttributes> {
  public id!: string;
  public user_id!: string;
  public code!: string;
  public expires_at!: Date;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

CodeValidation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'code_validations',
    timestamps: true,
    underscored: true,
  }
);

export default CodeValidation;