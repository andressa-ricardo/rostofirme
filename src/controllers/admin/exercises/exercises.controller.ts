// @ts-nocheck

import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Exercise from "../../../models/admin/exercises/exercises.admin.model";
import Video from "../../../models/admin/exercises/videos/video.admin.model";
import VideoAnalysis from "../../../models/admin/exercises/videos/analysis.admin.model";
import httpStatusCodes from "../../../utils/httpStatusCodes";
import { handleVideoUploadAndAnalysis } from "../../../helpers/uploadVideoHelper";
import { upload } from "../../../helpers/uploadHelper";
import Category from "../../../models/admin/category/category.admin.model";
import ExerciseCategory from "../../../models/admin/exercises/exercisecategory.model";

export const uploadMiddleware = upload.fields([
  { name: "videoFile", maxCount: 1 },
  { name: "videoThumbnail", maxCount: 1 },
  { name: "pdfFile", maxCount: 1 },
  { name: "exampleImage1", maxCount: 1 },
  { name: "exampleImage2", maxCount: 1 },
]);

export const createExercise = async (req: Request, res: Response) => {
  try {
    console.log("Corpo da requisição:", req.body);

    const { title, description, videoDuration, exerciseDuration, categories } =
      req.body;

    const files = req.files as {
      [fieldname: string]: Express.MulterS3.File[];
    };

    const videoFile = files?.videoFile?.[0]?.location;
    const videoThumbnail = files?.videoThumbnail?.[0]?.location;
    const pdfFile = files?.pdfFile?.[0]?.location;
    const exampleImage1 = files?.exampleImage1?.[0]?.location;
    const exampleImage2 = files?.exampleImage2?.[0]?.location;

    if (!title || title.trim() === "") {
      return res.status(httpStatusCodes.BAD_REQUEST.code).json({
        message: "O campo 'title' é obrigatório.",
      });
    }

    const newExercise = await Exercise.create({
      id: uuidv4(),
      title,
      description,
      pdfFile,
      exampleImage1,
      exampleImage2,
      videoDuration,
      exerciseDuration,
    });

    if (videoFile && videoThumbnail) {
      await Video.create({
        id: uuidv4(),
        videoFile,
        videoThumbnail,
        videoDuration,
        exercise_id: newExercise.id,
      });
    }

    if (categories) {
      let parsedCategories: string[] = [];
      try {
        parsedCategories = JSON.parse(categories);
      } catch (error) {
        return res.status(httpStatusCodes.BAD_REQUEST.code).json({
          message:
            "O campo 'categories' deve ser um array válido no formato JSON.",
        });
      }

      if (Array.isArray(parsedCategories)) {
        const existingCategories = await Category.findAll({
          where: { id: parsedCategories },
        });

        if (existingCategories.length) {
          await newExercise.addCategories(existingCategories);
        }
      }
    }

    res.status(httpStatusCodes.CREATED.code).json({
      message: "Exercício criado com sucesso.",
      data: newExercise,
    });
  } catch (error) {
    console.error("Erro ao criar exercício:", error);

    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao criar o exercício.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const listExercises = async (req: Request, res: Response) => {
  try {
    const exercises = await Exercise.findAll({
      include: [
        {
          model: Video,
          as: "video",
        },
        {
          model: Category,
          as: "categories",
          through: { attributes: [] },
        },
      ],
    });

    res.status(httpStatusCodes.OK.code).json({
      message: "Lista de exercícios recuperada com sucesso.",
      data: exercises,
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao listar os exercícios.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const getExerciseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findByPk(id, {
      include: [
        {
          model: Video,
          as: "video",
        },
        {
          model: Category,
          as: "categories",
          through: { attributes: [] },
        },
      ],
    });

    if (!exercise) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Exercício não encontrado.",
      });
    }

    res.status(httpStatusCodes.OK.code).json({
      message: "Exercício encontrado com sucesso.",
      data: exercise,
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao buscar o exercício.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const updateExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, categories, videoDuration, exerciseDuration } =
      req.body;

    const files = req.files as {
      [fieldname: string]: Express.MulterS3.File[];
    };

    const videoFile = files?.videoFile?.[0]?.location;
    const videoThumbnail = files?.videoThumbnail?.[0]?.location;

    const exercise = await Exercise.findByPk(id);
    if (!exercise) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Exercício não encontrado.",
      });
    }

    exercise.title = title ?? exercise.title;
    exercise.description = description ?? exercise.description;
    exercise.videoDuration = videoDuration
      ? parseInt(videoDuration, 10)
      : exercise.videoDuration;
    exercise.exerciseDuration = exerciseDuration
      ? parseInt(exerciseDuration, 10)
      : exercise.exerciseDuration;

    await exercise.save();

    if (videoFile && videoThumbnail) {
      const video = await Video.findOne({ where: { exercise_id: id } });
      if (video) {
        video.videoFile = videoFile;
        video.videoThumbnail = videoThumbnail;
        video.videoDuration = videoDuration
          ? parseInt(videoDuration, 10)
          : video.videoDuration;
        await video.save();
      } else {
        await Video.create({
          id: uuidv4(),
          videoFile,
          videoThumbnail,
          videoDuration,
          exercise_id: exercise.id,
        });
      }
    }

    if (categories) {
      let parsedCategories: string[] = [];
      try {
        parsedCategories = JSON.parse(categories);
      } catch (error) {
        return res.status(httpStatusCodes.BAD_REQUEST.code).json({
          message:
            "O campo 'categories' deve ser um array válido no formato JSON.",
        });
      }

      if (Array.isArray(parsedCategories)) {
        const existingCategories = await Category.findAll({
          where: { id: parsedCategories },
        });

        if (existingCategories.length) {
          await exercise.setCategories(existingCategories);
        } else {
          await exercise.setCategories([]);
        }
      }
    }

    res.status(httpStatusCodes.OK.code).json({
      message: "Exercício atualizado com sucesso.",
      data: exercise,
    });
  } catch (error) {
    console.error("Erro ao atualizar exercício:", error);

    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao atualizar o exercício.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const deleteExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const exercise = await Exercise.findByPk(id);

    if (!exercise) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Exercício não encontrado.",
      });
    }
    await ExerciseCategory.destroy({ where: { exerciseId: id } });

    await exercise.destroy();

    res.status(httpStatusCodes.OK.code).json({
      message: "Exercício deletado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao deletar exercício:", error);

    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao deletar o exercício!.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
