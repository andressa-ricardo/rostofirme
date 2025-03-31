import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Profile from "../../models/profile/profile.model";
import httpStatusCodes from "../../utils/httpStatusCodes";

export const createProfile = async (req: Request, res: Response) => {
  try {
    const { userId, bio } = req.body;

    if (!userId) {
      return res.status(httpStatusCodes.BAD_REQUEST.code).json({
        message: "O userId é obrigatório.",
      });
    }

    const profile = await Profile.create({
      id: uuidv4(),
      userId,
      bio,
    });

    res.status(httpStatusCodes.CREATED.code).json(profile);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao criar o perfil.",
      error: errorMessage,
    });
  }
};

export const getProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await Profile.findAll();

    res.status(httpStatusCodes.OK.code).json(profiles);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao buscar os perfis.",
      error: errorMessage,
    });
  }
};

export const getProfileById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findByPk(id);

    if (!profile) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Perfil não encontrado.",
      });
    }

    res.status(httpStatusCodes.OK.code).json(profile);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao buscar o perfil.",
      error: errorMessage,
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { bio } = req.body;

    const profile = await Profile.findByPk(id);

    if (!profile) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Perfil não encontrado.",
      });
    }

    profile.bio = bio;
    await profile.save();

    res.status(httpStatusCodes.OK.code).json(profile);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao atualizar o perfil.",
      error: errorMessage,
    });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findByPk(id);

    if (!profile) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Perfil não encontrado.",
      });
    }

    await profile.destroy();
    res.status(httpStatusCodes.NO_CONTENT.code).send();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao excluir o perfil.",
      error: errorMessage,
    });
  }
};
