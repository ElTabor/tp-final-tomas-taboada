"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_controller_1 = require("../controllers/auth.controller");
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const auth_schema_1 = require("../validators/auth.schema");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const rateLimit_middleware_1 = require("../middlewares/rateLimit.middleware");
const router = express_1.default.Router();
router.post("/register", (0, validate_middleware_1.default)(auth_schema_1.registerSchema), auth_controller_1.register);
router.post("/login", rateLimit_middleware_1.loginLimiter, (0, validate_middleware_1.default)(auth_schema_1.loginSchema), auth_controller_1.login);
router.post("/refresh", (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: "Refresh token missing" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        const accessToken = jsonwebtoken_1.default.sign({ userId: decoded.userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
        res.status(200).json({ accessToken });
    }
    catch (error) {
        next(error);
    }
});
router.post("/logout", auth_middleware_1.default, auth_controller_1.logout);
exports.default = router;
