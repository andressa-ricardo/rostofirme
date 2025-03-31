// @ts-nocheck

import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import fs from "fs";
import { S3, Rekognition } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import VideoAnalysis from "../models/admin/exercises/videos/analysis.admin.model";

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const rekognition = new Rekognition({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const createFolder = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, "../../public/assets/videos/temp");

    if (file.fieldname === "videoThumbnail") {
      uploadPath = path.join(__dirname, "../../public/assets/videos/thumb");
    } else {
      uploadPath = path.join(__dirname, "../../public/assets/videos/videofile");
    }

    createFolder(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const uploadVideo = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos de vídeo são permitidos."));
    }
  },
}).single("videoFile");

const uploadToS3 = async (
  filePath: string,
  fieldName: string,
  fileName: string
): Promise<string> => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Arquivo não encontrado: ${filePath}`);
  }

  const fileContent = fs.readFileSync(filePath);

  const folder = fieldName === "videoThumbnail" ? "thumb" : "videofile";
  const s3Key = `videos/${folder}/${fileName}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: s3Key,
    Body: fileContent,
    ContentType: multerS3.AUTO_CONTENT_TYPE,
    ACL: "public-read",
  };

  try {
    const uploadResult = await s3.upload(params).promise();
    console.log(`Upload bem-sucedido: ${uploadResult.Location}`);
    return uploadResult.Location;
  } catch (uploadError) {
    console.error("Erro no upload para o S3:", uploadError);
    throw uploadError;
  }
};

const startVideoAnalysis = async (s3ObjectKey: string): Promise<string> => {
  const params = {
    Video: {
      S3Object: {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Name: s3ObjectKey,
      },
    },
  };

  const response = await rekognition.startFaceDetection(params).promise();
  return response.JobId!;
};

const saveVideoAnalysis = async (
  videoId: string,
  motionData: string,
  facialExpressions: string,
  keypoints: string,
  durationAnalyzed: number
) => {
  await VideoAnalysis.create({
    id: uuidv4(),
    videoId,
    motionData,
    facialExpressions,
    keypoints,
    durationAnalyzed,
    analysisStatus: "completed",
  });
};

//  monitorar e salvar automaticamente a análise (opcional, se usando SNS)
export const monitorVideoAnalysis = async (jobId: string, videoId: string) => {
  try {
    const params = { JobId: jobId };
    const result = await rekognition.getFaceDetection(params).promise();

    const motionData = JSON.stringify(result.Faces);
    const facialExpressions = JSON.stringify(result);
    const keypoints = "[]";
    const durationAnalyzed = result.VideoMetadata?.DurationMillis! / 1000;
    await saveVideoAnalysis(
      videoId,
      motionData,
      facialExpressions,
      keypoints,
      durationAnalyzed
    );
  } catch (error) {
    console.error("Erro ao monitorar a análise do vídeo:", error);
  }
};

export const handleVideoUploadAndAnalysis = async (
  filePath: string,
  fieldName: string
): Promise<{ videoUrl: string; jobId: string }> => {
  try {
    console.log("Upload para AWS S3...");
    const fileName = path.basename(filePath);
    const videoUrl = await uploadToS3(filePath, fieldName, fileName);

    console.log("Iniciando análise de vídeo com AWS Rekognition...");
    const jobId = await startVideoAnalysis(fileName);

    fs.unlinkSync(filePath);

    return { videoUrl, jobId };
  } catch (error) {
    console.error("Erro ao processar o upload e análise do vídeo:", error);
    throw new Error("Erro ao processar o vídeo.");
  }
};
