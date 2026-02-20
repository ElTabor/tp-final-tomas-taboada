"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const generateAccessToken = (payload) => jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
const generateRefreshToken = (payload) => jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await user_1.default.findOne({ email });
        if (existingUser) {
            return next(new AppError_1.default("User already exists", 409));
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await user_1.default.create({
            email,
            password: hashedPassword,
        });
        res.status(201).json({
            message: "User registered successfully",
            userId: user._id,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await user_1.default.findOne({ email });
        if (!user) {
            return next(new AppError_1.default("Invalid credentials", 401));
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return next(new AppError_1.default("Invalid credentials", 401));
        }
        const accessToken = generateAccessToken({ userId: user._id, role: user.role });
        const refreshToken = generateRefreshToken({ userId: user._id });
        user.refreshToken = refreshToken;
        await user.save();
        res
            .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
        })
            .status(200)
            .json({
            message: "Login successful",
            accessToken,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const logout = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new AppError_1.default("User not authenticated", 401));
        }
        const user = await user_1.default.findById(req.user.userId);
        if (!user) {
            return next(new AppError_1.default("User not found", 404));
        }
        user.refreshToken = null;
        await user.save();
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
