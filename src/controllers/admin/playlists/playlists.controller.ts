// @ts-nocheck

import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Playlist from "../../../models/admin/playlists/playlists.admin.model";
import Exercise from "../../../models/admin/exercises/exercises.admin.model";
import httpStatusCodes from "../../../utils/httpStatusCodes";
import PlaylistExercise from "../../../models/admin/playlists/playlistexercise.admin.model";
import { uploadPlaylistImage } from "../../../helpers/uploadHelper";

export const createPlaylist = async (req: Request, res: Response) => {
  uploadPlaylistImage(req, res, async (err) => {
    if (err) {
      return res.status(httpStatusCodes.BAD_REQUEST.code).json({
        message: "Erro ao processar o upload da imagem.",
        error: err instanceof Error ? err.message : "Erro desconhecido",
      });
    }

    try {
      const { name, exercises } = req.body;

      if (!name || name.trim() === "") {
        return res.status(httpStatusCodes.BAD_REQUEST.code).json({
          message: "O campo 'name' é obrigatório.",
        });
      }

      console.log("Arquivo recebido:", req.file);

      const imageUrl = req.file?.location || null;
      console.log("URL da imagem salva:", imageUrl);

      const newPlaylist = await Playlist.create({
        name,
        coverImage: req.file?.location,
      });

      let exerciseIds: number[] = [];
      try {
        if (exercises) {
          exerciseIds = Array.isArray(exercises)
            ? exercises
            : JSON.parse(exercises);
        }
      } catch (parseError) {
        return res.status(httpStatusCodes.BAD_REQUEST.code).json({
          message: "Erro ao processar os exercícios.",
          error:
            parseError instanceof Error
              ? parseError.message
              : "Erro desconhecido",
        });
      }

      if (exerciseIds.length > 0) {
        const existingExercises = await Exercise.findAll({
          where: { id: exerciseIds },
        });

        if (existingExercises.length) {
          await newPlaylist.addExercises(existingExercises);
        }
      }

      res.status(httpStatusCodes.CREATED.code).json({
        message: "Playlist criada com sucesso.",
        data: newPlaylist,
      });
    } catch (error) {
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
        message: "Erro ao criar a playlist.",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  });
};

export const listPlaylists = async (req: Request, res: Response) => {
  try {
    const playlists = await Playlist.findAll({
      include: [
        {
          model: Exercise,
          as: "exercises",
        },
      ],
    });

    res.status(httpStatusCodes.OK.code).json({
      message: "Lista de playlists recuperada com sucesso.",
      data: playlists,
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao listar as playlists.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const getPlaylistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findByPk(id, {
      include: [
        {
          model: Exercise,
          as: "exercises",
        },
      ],
    });

    if (!playlist) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Playlist não encontrada.",
      });
    }

    res.status(httpStatusCodes.OK.code).json({
      message: "Playlist encontrada com sucesso.",
      data: playlist,
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao buscar a playlist.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const updatePlaylist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, coverImage, exercises } = req.body;

    const playlist = await Playlist.findByPk(id);

    if (!playlist) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Playlist não encontrada.",
      });
    }

    playlist.name = name ?? playlist.name;
    playlist.coverImage = coverImage ?? playlist.coverImage;
    playlist.exercises = exercises ?? playlist.exercises;

    await playlist.save();

    res.status(httpStatusCodes.OK.code).json({
      message: "Playlist atualizada com sucesso.",
      data: playlist,
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao atualizar a playlist.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const deletePlaylist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const playlist = await Playlist.findByPk(id);
    if (!playlist) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Playlist não encontrada.",
      });
    }

    await playlist.destroy();
    res.status(httpStatusCodes.OK.code).json({
      message: "Playlist deletada com sucesso.",
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao deletar a playlist.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
