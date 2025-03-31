export interface ExerciseAttributes {
  id: string | undefined;
  title: string | undefined;
  description: string | undefined;
  videoId: string | undefined;
  pdfFile: string | undefined;
  exampleImage1: string | undefined;
  exampleImage2: string | undefined;
  videoDuration: number | undefined;
  exerciseDuration: number | undefined;
  createdAt?: Date;
  updatedAt?: Date;
}
