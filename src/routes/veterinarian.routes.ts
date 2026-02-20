import express from "express";
import {
    getVeterinarians,
    getVeterinarian,
    createVeterinarian,
    updateVeterinarian,
    deleteVeterinarian,
} from "../controllers/veterinarian.controller";
import { authorize } from "../middlewares/authorize.middleware";

import { veterinarianValidation } from "../validators/veterinarian.validator";
import { handleValidationErrors } from "../middlewares/validate-express";

const router = express.Router();

// Only admins can manage veterinarians
router.get("/", authorize("admin"), getVeterinarians);
router.get("/:id", authorize("admin"), getVeterinarian);
router.post("/", authorize("admin"), veterinarianValidation, handleValidationErrors, createVeterinarian);
router.patch("/:id", authorize("admin"), veterinarianValidation, handleValidationErrors, updateVeterinarian);
router.put("/:id", authorize("admin"), veterinarianValidation, handleValidationErrors, updateVeterinarian);
router.delete("/:id", authorize("admin"), deleteVeterinarian);

export default router;
