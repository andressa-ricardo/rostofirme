import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Mission from "../../../models/admin/missions/missions.admin.model";
import Exercise from "../../../models/admin/exercises/exercises.admin.model";
import Category from "../../../models/admin/category/category.admin.model";
import httpStatusCodes from "../../../utils/httpStatusCodes";

export const createMission = async (req: Request, res: Response) => {
  try {
    console.log("Corpo da requisição:", req.body);

    const { title, description, exercises, categories } = req.body;

    if (!title || title.trim() === "") {
      return res.status(httpStatusCodes.BAD_REQUEST.code).json({
        message: "O campo 'title' é obrigatório.",
      });
    }

    const newMission = await Mission.create({
      id: uuidv4(),
      title,
      description,
    });

    if (exercises && Array.isArray(exercises)) {
      console.log("Exercícios recebidos:", exercises);

      const existingExercises = await Exercise.findAll({
        where: { id: exercises },
      });

      if (existingExercises.length) {
        await newMission.addExercises(existingExercises);
      }
    }

    if (categories && Array.isArray(categories)) {
      console.log("Categorias recebidas:", categories);

      const existingCategories = await Category.findAll({
        where: { id: categories },
      });

      if (existingCategories.length) {
        await newMission.addCategories(existingCategories);
      }
    }

    res.status(httpStatusCodes.CREATED.code).json({
      message: "Missão criada com sucesso.",
      data: newMission,
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao criar a missão.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const listMissions = async (_req: Request, res: Response) => {
  try {
    const missions = await Mission.findAll({
      include: [
        { model: Exercise, as: "exercises" },
        { model: Category, as: "categories" },
      ],
    });

    return res.status(httpStatusCodes.OK.code).json(missions);
  } catch (error: any) {
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao buscar missões.",
      error: error.message,
    });
  }
};

export const getMissionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mission = await Mission.findByPk(id, {
      include: [
        { model: Exercise, as: "exercises" },
        { model: Category, as: "categories" },
      ],
    });

    if (!mission) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Missão não encontrada.",
      });
    }

    res.status(httpStatusCodes.OK.code).json({
      message: "Missão encontrada com sucesso.",
      data: mission,
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao buscar a missão.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const updateMission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, exercises, categories } = req.body;

    const mission = await Mission.findByPk(id);
    if (!mission) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Missão não encontrada.",
      });
    }

    if (title) mission.title = title;
    if (description) mission.description = description;
    await mission.save();

    if (exercises && Array.isArray(exercises)) {
      const existingExercises = await Exercise.findAll({
        where: { id: exercises },
      });
      if (existingExercises.length !== exercises.length) {
        return res.status(httpStatusCodes.BAD_REQUEST.code).json({
          message: "Um ou mais exercícios não foram encontrados.",
        });
      }
      await mission.setExercises(existingExercises);
    }

    if (categories && Array.isArray(categories)) {
      const existingCategories = await Category.findAll({
        where: { id: categories },
      });
      if (existingCategories.length !== categories.length) {
        return res.status(httpStatusCodes.BAD_REQUEST.code).json({
          message: "Uma ou mais categorias não foram encontradas.",
        });
      }
      await mission.setCategories(existingCategories);
    }

    return res.status(httpStatusCodes.OK.code).json(mission);
  } catch (error: any) {
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao atualizar missão.",
      error: error.message,
    });
  }
};

export const deleteMission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const mission = await Mission.findByPk(id);
    if (!mission) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Missão não encontrada.",
      });
    }

    await mission.destroy();
    res.status(httpStatusCodes.OK.code).json({
      message: "Missão deletada com sucesso.",
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao deletar a missão.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
