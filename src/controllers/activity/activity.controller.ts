import { NextFunction, Request, RequestHandler, Response } from "express";
import Activity from "../../models/activity/activity.model";

export const createActivity: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getActivities = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const activities = await Activity.findAll();
    res.json(activities);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getActivityById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const activity = await Activity.findByPk(id);
    if (!activity) {
      res.status(404).json({ message: "Atividade não encontrada" });
    }
    res.json(activity);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const [updated] = await Activity.update(req.body, { where: { id } });
    if (!updated) {
      res.status(404).json({ message: "Atividade não encontrada" });
    }
    const updatedActivity = await Activity.findByPk(id);
    res.json(updatedActivity);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Activity.destroy({ where: { id } });
    if (!deleted) {
      res.status(404).json({ message: "Atividade não encontrada" });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
