"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTask = exports.getTasks = void 0;
const task_1 = __importDefault(require("../models/task"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const getTasks = async (req, res, next) => {
    try {
        const tasks = await task_1.default.find({ user: req.user.userId });
        res.status(200).json(tasks);
    }
    catch (error) {
        next(error);
    }
};
exports.getTasks = getTasks;
const getTask = async (req, res, next) => {
    try {
        const task = await task_1.default.findOne({ _id: req.params.id, user: req.user.userId });
        if (!task) {
            return next(new AppError_1.default("Task not found", 404));
        }
        res.status(200).json(task);
    }
    catch (error) {
        next(error);
    }
};
exports.getTask = getTask;
const createTask = async (req, res, next) => {
    try {
        const task = await task_1.default.create({
            title: req.body.title,
            user: req.user.userId,
        });
        res.status(201).json(task);
    }
    catch (error) {
        next(error);
    }
};
exports.createTask = createTask;
const updateTask = async (req, res, next) => {
    try {
        const task = await task_1.default.findOneAndUpdate({ _id: req.params.id, user: req.user.userId }, req.body, { new: true });
        if (!task) {
            return next(new AppError_1.default("Task not found", 404));
        }
        res.status(200).json(task);
    }
    catch (error) {
        next(error);
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res, next) => {
    try {
        const task = await task_1.default.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId,
        });
        if (!task) {
            return next(new AppError_1.default("Task not found", 404));
        }
        res.status(200).json({ message: "Task deleted" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTask = deleteTask;
