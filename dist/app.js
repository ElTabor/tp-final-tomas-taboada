"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const protected_routes_1 = __importDefault(require("./routes/protected.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Connect to MongoDB
(0, db_1.default)();
app.use("/api/auth", auth_routes_1.default);
app.use("/api/protected", protected_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/tasks", task_routes_1.default);
app.get("/check", (req, res) => {
    res.status(200).json({ status: "OK" });
});
app.use(error_middleware_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
