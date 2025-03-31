import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../../models/user/user.model';
import Auth from '../../models/auth/auth.model';
import Profile from '../../models/profile/profile.model';
import httpStatusCodes from '../../utils/httpStatusCodes';

const JWT_SECRET = process.env.JWT_SECRET || 'secrettoken';
const JWT_EXPIRATION = '6h'; 

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(httpStatusCodes.UNAUTHORIZED.code).json({
        message: 'Credenciais inválidas.',
      });
    }

    const isPasswordValid = await user.isPasswordValid(password);
    if (!isPasswordValid) {
      return res.status(httpStatusCodes.UNAUTHORIZED.code).json({
        message: 'Credenciais inválidas.',
      });
    }

    const token = generateToken(user.id);

    const existingAuth = await Auth.findOne({ where: { userId: user.id } });
    if (existingAuth) {
      await existingAuth.update({ token });
    } else {
      await Auth.create({ userId: user.id, token });
    }

    const profile = await Profile.findOne({ where: { userId: user.id } });

    res.status(httpStatusCodes.OK.code).json({
      message: 'Login realizado com sucesso.',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        age: user.age,
      },
      profile: profile || { bio: 'Nenhuma bio cadastrada' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: 'Erro ao realizar login.',
      error: errorMessage,
    });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(httpStatusCodes.UNAUTHORIZED.code).json({
        message: 'Token não fornecido.',
      });
    }

    const authToken = await Auth.findOne({ where: { token } });
    if (!authToken) {
      return res.status(httpStatusCodes.UNAUTHORIZED.code).json({
        message: 'Token inválido ou expirado.',
      });
    }

    const decoded = jwt.verify(token as string, JWT_SECRET) as { userId: string };

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(httpStatusCodes.UNAUTHORIZED.code).json({
        message: 'Usuário não encontrado.',
      });
    }

    const profile = await Profile.findOne({ where: { userId: user.id } });

    res.status(httpStatusCodes.OK.code).json({
      message: 'Usuário autenticado.',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      profile: profile || { bio: 'Nenhuma bio cadastrada' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: 'Erro ao verificar autenticação.',
      error: errorMessage,
    });
  }
};


export const logoutUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(httpStatusCodes.BAD_REQUEST.code).json({
        message: 'Token não informado.',
      });
    }

    const authToken = await Auth.findOne({ where: { token } });
    if (!authToken) {
      return res.status(httpStatusCodes.NOT_FOUND.code).json({
        message: 'Token não encontrado ou já removido.',
      });
    }

    await authToken.destroy();

    res.status(httpStatusCodes.OK.code).json({
      message: 'Logout realizado com sucesso.',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({
      message: 'Erro ao realizar logout.',
      error: errorMessage,
    });
  }
};