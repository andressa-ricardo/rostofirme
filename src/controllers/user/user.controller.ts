import { Request, Response, NextFunction } from "express";
import User from "../../models/user/user.model";
import CodeValidation from "../../models/code/codevalidation.model";
import httpStatusCodes from "../../utils/httpStatusCodes";
import { upload, uploadAvatar } from "../../helpers/uploadHelper";
import { generateVerificationCode } from "../../helpers/generateCodeHelper";
import { sendEmail } from "../../helpers/emailHelper";
import path from "path";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import fs from "fs";

export const enviarEmail = async (
  destinatario: string,
  assunto: string,
  templatePath: string,
  placeholders: { [key: string]: string }
): Promise<boolean> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let template = fs.readFileSync(path.join(__dirname, templatePath), "utf8");

    Object.keys(placeholders).forEach((key) => {
      template = template.replace(
        new RegExp(`{{${key}}}`, "g"),
        placeholders[key]
      );
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: destinatario,
      subject: assunto,
      html: template,
    });

    return true;
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return false;
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, age, email, password, role } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(httpStatusCodes.CONFLICT.code).json({
        message: "Já existe um usuário com este email.",
      });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      age,
      email,
      password,
      role,
      avatar: "",
      pushToken: null,
      activated: false,
    });

    res.status(httpStatusCodes.CREATED.code).json({
      message: "Usuário criado com sucesso.",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadUserAvatar = async (req: Request, res: Response) => {
  try {
    uploadAvatar.single("avatar")(req, res, async (err) => {
      if (err) {
        return res.status(httpStatusCodes.BAD_REQUEST.code).json({
          message: "Erro ao fazer upload do avatar.",
          error: err instanceof Error ? err.message : "Erro desconhecido",
        });
      }

      if (!req.file) {
        return res.status(httpStatusCodes.BAD_REQUEST.code).json({
          message: "Nenhum arquivo de avatar enviado.",
        });
      }

      const avatarUrl = (req.file as any).location;

      const userId = req.params.userId;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(httpStatusCodes.NOT_FOUND.code).json({
          message: "Usuário não encontrado.",
        });
      }

      user.avatar = avatarUrl;
      await user.save();

      res.status(httpStatusCodes.OK.code).json({
        message: "Avatar atualizado com sucesso.",
        user: user,
        avatarUrl,
      });
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao fazer upload do avatar.",
      error: errorMessage,
    });
  }
};

export const sendPasswordResetCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "E-mail não cadastrado.",
      });
    }

    const verificationCode = generateVerificationCode();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await CodeValidation.create({
      id: uuidv4(),
      user_id: user.id,
      code: verificationCode,
      expires_at: expiresAt,
    });

    await sendEmail(email, "Redefinição de senha", "password-reset", {
      userName: user.firstName,
      code: verificationCode,
    });

    res.status(httpStatusCodes.OK.code).json({
      message: "O código de verificação foi enviado para o e-mail informado.",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao enviar o código de verificação.",
      error: errorMessage,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "E-mail não cadastrado.",
      });
    }

    const codeValidation = await CodeValidation.findOne({
      where: {
        user_id: user.id,
        code: code,
        expires_at: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!codeValidation) {
      return res.status(httpStatusCodes.BAD_REQUEST.code).json({
        message: "Código de verificação inválido ou expirado.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    await codeValidation.destroy();

    res.status(httpStatusCodes.OK.code).json({
      message: "Senha redefinida com sucesso.",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao redefinir a senha.",
      error: errorMessage,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { firstName, lastName, age, email, password, activated, role } =
      req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Usuário não encontrado.",
      });
    }

    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.age = age ?? user.age;
    user.email = email ?? user.email;
    user.password = password ?? user.password;
    user.activated = activated ?? user.activated;
    user.role = role ?? user.role;

    await user.save();

    res.status(httpStatusCodes.OK.code).json({
      message: "Usuário atualizado com sucesso.",
      data: user,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao atualizar usuário.",
      error: errorMessage,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: "Usuário não encontrado.",
      });
    }

    await user.destroy();
    res.status(httpStatusCodes.OK.code).json({
      message: "Usuário excluído com sucesso.",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: "Erro ao excluir usuário.",
      error: errorMessage,
    });
  }
};
