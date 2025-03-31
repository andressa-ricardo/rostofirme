import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import path from "path";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION,
});

const storage = multerS3({
  s3: s3,
  bucket:
    process.env.AWS_S3_BUCKET_NAME ||
    (() => {
      throw new Error("AWS_S3_BUCKET_NAME is not defined");
    })(),
  contentType: multerS3.AUTO_CONTENT_TYPE, // 🔹 abre as imagens em uma nova aba ao invés de baixar ela no dispositivo
  key: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    let folderPath = "images/";

    if (file.fieldname === "avatar") {
      folderPath += "avatars/";
    } else if (
      ["answerImage1", "answerImage2", "answerImage3"].includes(file.fieldname)
    ) {
      folderPath = "images/client_images/";
    } else if (file.fieldname === "coverImage") {
      folderPath += "cover/";
    } else if (file.mimetype.startsWith("image/")) {
      folderPath += "example/";
    } else if (file.mimetype === "application/pdf") {
      folderPath = "files/";
    } else if (file.mimetype.startsWith("video/")) {
      if (file.fieldname === "videoThumbnail") {
        folderPath = "videos/thumb/";
      } else if (file.fieldname === "videoFile") {
        folderPath = "videos/videofile/";
      }
    } else {
      return cb(new Error("Tipo de arquivo não suportado."), "");
    }

    const fileName = `${file.fieldname}-${Date.now()}${fileExtension}`;
    cb(null, folderPath + fileName);
  },
});

const uploadQuestionnaireImage = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens JPEG, PNG e GIF são permitidas."));
    }
  },
}).fields([
  { name: "answerImage1", maxCount: 1 },
  { name: "answerImage2", maxCount: 1 },
  { name: "answerImage3", maxCount: 1 },
]);

export const uploadAvatar = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens JPEG, PNG e GIF são permitidas."));
    }
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 },

  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "video/mp4",
    ];

    console.log("File received:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
    });

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.error("File rejected:", {
        originalname: file.originalname,
        mimetype: file.mimetype,
      });
      cb(new Error("Apenas imagens e PDFs são permitidos."));
    }
  },
});

const uploadPlaylistImage = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    console.log(file);
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens JPEG, PNG e GIF são permitidas."));
    }
  },
}).single("coverImage");

export { upload, uploadQuestionnaireImage, uploadPlaylistImage };
