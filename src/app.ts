import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import ownerRoutes from "./routes/owner.routes";
import petRoutes from "./routes/pet.routes";
import veterinarianRoutes from "./routes/veterinarian.routes";
import medicalRecordRoutes from "./routes/medicalRecord.routes";
import errorHandler from "./middlewares/error.middleware";

dotenv.config();

const app = express();

app.use(express.json());
// Connect to MongoDB
connectDB();

import authMiddleware from "./middlewares/auth.middleware";

// Public routes
app.use("/api/auth", authRoutes);

// RESTful Entity Routes (Protected)
app.use("/api/owners", authMiddleware, ownerRoutes);
app.use("/api/pets", authMiddleware, petRoutes);
app.use("/api/veterinarians", authMiddleware, veterinarianRoutes);
app.use("/api/medical-records", authMiddleware, medicalRecordRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
