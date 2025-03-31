export interface QuestionnaireAttributes {
  id: string;
  question: string;
  questionNumber: number;
  type: "boolean" | "scale" | "text" | "multiple_choice" | "image";
}
