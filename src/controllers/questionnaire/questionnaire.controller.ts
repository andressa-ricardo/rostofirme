// @ts-nocheck

import { Request, RequestHandler, Response } from "express";
import QuestionnaireResponse from "../../models/questionnaire/questionnaire.model";
import User from "../../models/user/user.model";
import Questionnaire from "../../models/admin/questionnaire/questionnaire.admin.model";

/////////PERGUNTAS DO QUESTIONÁRIO

export const createQuestionnaire = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { question, questionNumber, type } = req.body;

    if (!question || questionNumber === undefined || !type) {
      return res.status(400).json({
        error:
          "Os campos 'question', 'questionNumber' e 'type' são obrigatórios.",
      });
    }

    const newQuestionnaire = await Questionnaire.create({
      question,
      questionNumber,
      type,
    });

    return res.status(201).json(newQuestionnaire);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar o questionário." });
  }
};

export const updateQuestionnaire: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, questionNumber, type } = req.body;

    const questionnaire = await Questionnaire.findByPk(id);
    if (!questionnaire) {
      return res.status(404).json({ error: "Questionário não encontrado." });
    }

    if (question !== undefined) questionnaire.question = question;
    if (questionNumber !== undefined)
      questionnaire.questionNumber = questionNumber;
    if (type !== undefined) questionnaire.type = type;

    await questionnaire.save();
    return res.status(200).json(questionnaire);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar o questionário." });
  }
};

export const getQuestionnaires: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const questionnaires = await Questionnaire.findAll();
    res.status(200).json(questionnaires);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os questionários." });
  }
};

export const deleteQuestionnaire = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const questionnaire = await Questionnaire.findByPk(id);
    if (!questionnaire) {
      return res.status(404).json({ error: "Questionário não encontrado." });
    }

    await questionnaire.destroy();
    return res
      .status(200)
      .json({ message: "Questionário deletado com sucesso." });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar o questionário." });
  }
};

/////RESPOSTAS DO QUESTIONÁRIO

export const createResponse = async (req: Request, res: Response) => {
  try {
    console.log("Corpo da requisição:", req.body);
    console.log("Arquivo recebido:", req.file);

    const { userId, questionId, answer } = req.body;

    if (!userId || !questionId) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    const question = await Questionnaire.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ error: "Pergunta não encontrada." });
    }

    let newResponseData: Partial<QuestionnaireResponseAttributes> = {
      userId,
      questionId,
    };

    switch (question.type) {
      case "boolean":
        if (typeof answer !== "boolean") {
          return res
            .status(400)
            .json({ error: "Resposta inválida. Deve ser um booleano." });
        }
        newResponseData.answerBoolean = answer;
        break;

      case "scale":
        if (typeof answer !== "number" || answer < 1 || answer > 5) {
          return res.status(400).json({
            error: "Resposta inválida. Deve ser um número entre 1 e 5.",
          });
        }
        newResponseData.answerScale = answer;
        break;

      case "text":
        if (typeof answer !== "string") {
          return res
            .status(400)
            .json({ error: "Resposta inválida. Deve ser um texto." });
        }
        newResponseData.answerText = answer;
        break;

      case "multiple_choice":
        if (
          !Array.isArray(answer) ||
          !answer.every((item) => typeof item === "string")
        ) {
          return res.status(400).json({
            error: "Resposta inválida. Deve ser uma lista de strings.",
          });
        }
        newResponseData.answerMultipleChoice = answer;
        break;

      case "image":
        const files = req.files as {
          [fieldname: string]: Express.MulterS3.File[];
        };

        if (files["answerImage1"]) {
          newResponseData.answerImage1 = files["answerImage1"][0].location;
        }
        if (files["answerImage2"]) {
          newResponseData.answerImage2 = files["answerImage2"][0].location;
        }
        if (files["answerImage3"]) {
          newResponseData.answerImage3 = files["answerImage3"][0].location;
        }
        break;

      default:
        return res
          .status(400)
          .json({ error: "Tipo de pergunta desconhecido." });
    }

    const response = await QuestionnaireResponse.create(newResponseData);
    return res.status(201).json(response);
  } catch (error) {
    console.error("Erro ao criar a resposta:", error);
    return res.status(500).json({ error: "Erro ao criar a resposta." });
  }
};

export const getAllResponses = async (req: Request, res: Response) => {
  try {
    const responses = await QuestionnaireResponse.findAll({
      include: [
        { model: User, as: "user" },
        { model: Questionnaire, as: "question" },
      ],
      attributes: [
        "id",
        "userId",
        "questionId",
        "answerBoolean",
        "answerScale",
        "answerText",
        "answerMultipleChoice",
        "answerImage",
        "createdAt",
      ],
    });

    return res.json(responses);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar as respostas." });
  }
};

export const getResponsesByUser: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const { userId } = req.params;
    const responses = await QuestionnaireResponse.findAll({
      where: { userId },
      include: [
        {
          model: Questionnaire,
          as: "question",
        },
      ],
    });

    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar respostas do usuário." });
  }
};

export const updateResponse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    const response = await QuestionnaireResponse.findByPk(id);
    if (!response) {
      return res.status(404).json({ error: "Resposta não encontrada." });
    }

    response.answer = answer;
    await response.save();

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar a resposta." });
  }
};

export const deleteResponse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await QuestionnaireResponse.findByPk(id);
    if (!response) {
      return res.status(404).json({ error: "Resposta não encontrada." });
    }

    await response.destroy();
    return res.json({ message: "Resposta deletada com sucesso." });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar a resposta." });
  }
};

export const getUserResponses = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; // Pegando o ID do usuário da rota

    if (!userId) {
      return res.status(400).json({ error: "ID do usuário é obrigatório." });
    }

    const responses = await QuestionnaireResponse.findAll({
      where: { userId }, // Filtra apenas as respostas do usuário específico
      include: [
        {
          model: Questionnaire,
          as: "question",
          attributes: ["id", "question", "type", "questionNumber"], // Informações da pergunta
        },
      ],
      attributes: [
        "id",
        "questionId",
        "answerBoolean",
        "answerScale",
        "answerText",
        "answerMultipleChoice",
        "answerImage1",
        "answerImage2",
        "answerImage3",
        "createdAt",
      ],
    });

    // Estruturando os dados agrupados por questão
    const groupedResponses = responses.reduce((acc, response) => {
      const questionId = response.questionId;
      const questionInfo = response.question;

      if (!acc[questionId]) {
        acc[questionId] = {
          id: questionInfo.id,
          question: questionInfo.question,
          type: questionInfo.type,
          questionNumber: questionInfo.questionNumber,
          responses: [],
        };
      }

      acc[questionId].responses.push({
        id: response.id,
        answerBoolean: response.answerBoolean,
        answerScale: response.answerScale,
        answerText: response.answerText,
        answerMultipleChoice: response.answerMultipleChoice,
        answerImages: [
          response.answerImage1,
          response.answerImage2,
          response.answerImage3,
        ].filter((img) => img), // Remove imagens vazias
        createdAt: response.createdAt,
      });

      return acc;
    }, {});

    return res.json(Object.values(groupedResponses));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar as respostas." });
  }
};
