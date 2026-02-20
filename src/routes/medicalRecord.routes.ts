import express from "express";
import {
    getMedicalRecords,
    getMedicalRecord,
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
} from "../controllers/medicalRecord.controller";
import { authorize } from "../middlewares/authorize.middleware";

import { medicalRecordValidation } from "../validators/medicalRecord.validator";
import { handleValidationErrors } from "../middlewares/validate-express";

const router = express.Router();

// Veterinarians and admins can view and create appointments
router.get("/", authorize("admin", "veterinarian"), getMedicalRecords);
router.get("/:id", authorize("admin", "veterinarian"), getMedicalRecord);
router.post("/", authorize("admin", "veterinarian"), medicalRecordValidation, handleValidationErrors, createMedicalRecord);

// Only admins can update and delete appointments
router.patch("/:id", authorize("admin"), medicalRecordValidation, handleValidationErrors, updateMedicalRecord);
router.put("/:id", authorize("admin"), medicalRecordValidation, handleValidationErrors, updateMedicalRecord);
router.delete("/:id", authorize("admin"), deleteMedicalRecord);

export default router;
