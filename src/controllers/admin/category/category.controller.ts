import { Request, Response } from "express";
import Category from "../../../models/admin/category/category.admin.model";
import httpStatusCodes from "../../../utils/httpStatusCodes";
import { v4 as uuidv4 } from "uuid";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(httpStatusCodes.CONFLICT.code).json({
        message: "Já existe uma categoria com este nome.",
      });
    }

    const category = await Category.create({
      id: uuidv4(),
      name,
    });

    res.status(httpStatusCodes.CREATED.code).json({
      message: "Categoria criada com sucesso.",
      data: category,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao criar categoria.",
      error: errorMessage,
    });
  }
};

export const listCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();
    res.status(httpStatusCodes.OK.code).json({
      message: "Categorias listadas com sucesso.",
      data: categories,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao listar categorias.",
      error: errorMessage,
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Categoria não encontrada.",
      });
    }

    res.status(httpStatusCodes.OK.code).json({
      message: "Categoria encontrada com sucesso.",
      data: category,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao buscar categoria.",
      error: errorMessage,
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Categoria não encontrada.",
      });
    }

    category.name = name ?? category.name;
    await category.save();

    res.status(httpStatusCodes.OK.code).json({
      message: "Categoria atualizada com sucesso.",
      data: category,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao atualizar categoria.",
      error: errorMessage,
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Categoria não encontrada.",
      });
    }

    await category.destroy();
    res.status(httpStatusCodes.OK.code).json({
      message: "Categoria deletada com sucesso.",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao deletar categoria.",
      error: errorMessage,
    });
  }
};
