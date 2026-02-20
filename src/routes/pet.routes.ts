import express from "express";
import {
    getPets,
    getPet,
    createPet,
    updatePet,
    deletePet,
} from "../controllers/pet.controller";
import { authorize } from "../middlewares/authorize.middleware";

import { petValidation } from "../validators/pet.validator";
import { handleValidationErrors } from "../middlewares/validate-express";

const router = express.Router();

// Only admins can manage pets
router.get("/", authorize("admin"), getPets);
router.get("/:id", authorize("admin"), getPet);
router.post("/", authorize("admin"), petValidation, handleValidationErrors, createPet);
router.patch("/:id", authorize("admin"), petValidation, handleValidationErrors, updatePet);
router.put("/:id", authorize("admin"), petValidation, handleValidationErrors, updatePet);
router.delete("/:id", authorize("admin"), deletePet);

export default router;
