import { Request, Response } from "express";
import PrivacyPolicy from "../../../models/admin/privacy/privacy.admin.model";
import httpStatusCodes from "../../../utils/httpStatusCodes";

export const createPrivacyPolicy = async (req: Request, res: Response) => {
  try {
    const { policy } = req.body;

    if (!policy) {
      return res.status(httpStatusCodes.BAD_REQUEST.code).json({
        message: "O campo 'policy' é obrigatório.",
      });
    }

    const newPolicy = await PrivacyPolicy.create({ policy });

    res.status(httpStatusCodes.CREATED.code).json({
      message: "Política de privacidade criada com sucesso.",
      data: newPolicy,
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao criar a política de privacidade.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const listPrivacyPolicies = async (req: Request, res: Response) => {
  try {
    const policies = await PrivacyPolicy.findAll();

    res.status(httpStatusCodes.OK.code).json({
      message: "Lista de políticas de privacidade recuperada com sucesso.",
      data: policies,
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao listar as políticas de privacidade.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const getPrivacyPolicyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const policy = await PrivacyPolicy.findByPk(id);

    if (!policy) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Política de privacidade não encontrada.",
      });
    }

    res.status(httpStatusCodes.OK.code).json({
      message: "Política de privacidade encontrada com sucesso.",
      data: policy,
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao buscar a política de privacidade.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const updatePrivacyPolicy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { policy } = req.body;

    const privacyPolicy = await PrivacyPolicy.findByPk(id);

    if (!privacyPolicy) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Política de privacidade não encontrada.",
      });
    }

    privacyPolicy.policy = policy ?? privacyPolicy.policy;

    await privacyPolicy.save();

    res.status(httpStatusCodes.OK.code).json({
      message: "Política de privacidade atualizada com sucesso.",
      data: privacyPolicy,
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao atualizar a política de privacidade.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const deletePrivacyPolicy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const privacyPolicy = await PrivacyPolicy.findByPk(id);

    if (!privacyPolicy) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Política de privacidade não encontrada.",
      });
    }

    await privacyPolicy.destroy();

    res.status(httpStatusCodes.OK.code).json({
      message: "Política de privacidade deletada com sucesso.",
    });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao deletar a política de privacidade.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
