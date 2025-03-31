import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import MySaves from "../../models/saves/mysaves.model";
import Video from "../../models/admin/exercises/videos/video.admin.model";
import httpStatusCodes from "../../utils/httpStatusCodes";

export const saveVideo = async (req: Request, res: Response) => {
  try {
    const { userId, videoId } = req.body;

    const existingSave = await MySaves.findOne({ where: { userId, videoId } });

    if (existingSave) {
      return res
        .status(httpStatusCodes.CONFLICT.code)
        .json({ message: "Vídeo já foi salvo anteriormente." });
    }

    const savedVideo = await MySaves.create({
      id: uuidv4(),
      userId,
      videoId,
      isSaved: true,
    });

    return res.status(httpStatusCodes.CREATED.code).json({
      message: "Vídeo salvo com sucesso!",
      savedVideo,
    });
  } catch (error) {
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao salvar o vídeo.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const removeSavedVideo = async (req: Request, res: Response) => {
  try {
    const { userId, videoId } = req.body;

    const savedVideo = await MySaves.findOne({ where: { userId, videoId } });

    if (!savedVideo) {
      return res
        .status(httpStatusCodes.NOT_FOUND.code)
        .json({ message: "Vídeo salvo não encontrado." });
    }

    await savedVideo.destroy();

    return res
      .status(httpStatusCodes.OK.code)
      .json({ message: "Vídeo removido dos salvos com sucesso!" });
  } catch (error) {
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao remover o vídeo salvo.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const getSavedVideos = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const savedVideos = await MySaves.findAll({
      where: { userId },
      include: [
        {
          model: Video,
          as: "videoDetails",
        },
      ],
    });

    return res.status(httpStatusCodes.OK.code).json(savedVideos);
  } catch (error) {
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao buscar vídeos salvos.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
