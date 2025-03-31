import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Mapping from "../../../models/admin/mapping/mapping.admin.model";
import httpStatusCodes from "../../../utils/httpStatusCodes";

export const createMapping = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    const newMapping = await Mapping.create({
      id: uuidv4(),
      question,
    });

    res.status(httpStatusCodes.CREATED.code).json({
      message: "Mapeamento criado com sucesso.",
      data: newMapping,
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao criar o mapeamento.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const listMappings = async (req: Request, res: Response) => {
  try {
    const mappings = await Mapping.findAll();
    res.status(httpStatusCodes.OK.code).json({
      message: "Lista de mapeamentos recuperada com sucesso.",
      data: mappings,
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao listar os mapeamentos.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const getMappingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mapping = await Mapping.findByPk(id);

    if (!mapping) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Mapeamento não encontrado.",
      });
    }

    res.status(httpStatusCodes.OK.code).json({
      message: "Mapeamento encontrado com sucesso.",
      data: mapping,
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao buscar o mapeamento.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const updateMapping = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question } = req.body;

    const mapping = await Mapping.findByPk(id);

    if (!mapping) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Mapeamento não encontrado.",
      });
    }

    mapping.question = question ?? mapping.question;

    await mapping.save();

    res.status(httpStatusCodes.OK.code).json({
      message: "Mapeamento atualizado com sucesso.",
      data: mapping,
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao atualizar o mapeamento.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const deleteMapping = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const mapping = await Mapping.findByPk(id);
    if (!mapping) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Mapeamento não encontrado.",
      });
    }

    await mapping.destroy();
    res.status(httpStatusCodes.OK.code).json({
      message: "Mapeamento deletado com sucesso.",
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao deletar o mapeamento.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
