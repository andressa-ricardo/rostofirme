import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import { v4 as uuidv4 } from "uuid";
import User from "../user/user.model";
import Questionnaire from "../admin/questionnaire/questionnaire.admin.model";
import { QuestionnaireResponseAttributes } from "../../@types/questionnaire";

interface QuestionnaireResponseCreationAttributes
  extends Optional<QuestionnaireResponseAttributes, "id"> {}

class QuestionnaireResponse
  extends Model<
    QuestionnaireResponseAttributes,
    QuestionnaireResponseCreationAttributes
  >
  implements QuestionnaireResponseAttributes
{
  public id!: string;
  public userId!: string;
  public questionId!: string;
  public answerBoolean?: boolean;
  public answerScale?: number;
  public answerText?: string;
  public answerMultipleChoice?: string[];
  public answerImage1?: string;
  public answerImage2?: string;
  public answerImage3?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

QuestionnaireResponse.init(
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
    questionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Questionnaire,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    answerBoolean: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    answerScale: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    answerText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    answerMultipleChoice: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    answerImage1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    answerImage2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    answerImage3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "QuestionnaireResponse",
    tableName: "questionnaire_responses",
    timestamps: true,
  }
);

export default QuestionnaireResponse;
