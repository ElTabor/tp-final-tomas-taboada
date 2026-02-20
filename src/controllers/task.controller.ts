import { Response, NextFunction } from "express";
import Task from "../models/task";
import AppError from "../utils/AppError";
import { AuthRequest } from "../types/express";

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tasks = await Task.find({ user: (req.user as any).userId });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: (req.user as any).userId });
    if (!task) {
      return next(new AppError("Task not found", 404));
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      user: (req.user as any).userId,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: (req.user as any).userId },
      req.body,
      { new: true }
    );

    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: (req.user as any).userId,
    });

    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};
