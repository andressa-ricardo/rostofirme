import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../config/database";
import { v4 as uuidv4 } from "uuid";
import { QuestionnaireAttributes } from "../../../@types/admin/questionnaire";

interface QuestionnaireCreationAttributes
  extends Optional<QuestionnaireAttributes, "id"> {}

type QuestionType = "boolean" | "scale" | "text" | "multiple_choice" | "image";

class Questionnaire
  extends Model<QuestionnaireAttributes, QuestionnaireCreationAttributes>
  implements QuestionnaireAttributes
{
  public id!: string;
  public question!: string;
  public questionNumber!: number;
  public type!: QuestionType;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Questionnaire.init(
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
    questionNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        "boolean",
        "scale",
        "text",
        "multiple_choice",
        "image"
      ),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Questionnaire",
    tableName: "questionnaires",
    timestamps: true,
  }
);

export default Questionnaire;
