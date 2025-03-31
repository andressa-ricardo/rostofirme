import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ error: "Rota não encontrada 🤡" });
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo deu errado! 🥴" });
};
