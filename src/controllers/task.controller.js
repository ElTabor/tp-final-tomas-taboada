const Task = require("../models/task");
const AppError = require("../utils/AppError");

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.userId });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.userId });
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      user: req.user.userId
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
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

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};
