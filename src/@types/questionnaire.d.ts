export interface QuestionnaireResponseAttributes {
  id: string;
  userId: string;
  questionId: string;
  answerBoolean?: boolean;
  answerScale?: number;
  answerText?: string;
  answerMultipleChoice?: string[];
  answerImage1?: string;
  answerImage2?: string;
  answerImage3?: string;

}