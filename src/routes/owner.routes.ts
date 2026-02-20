import express from "express";
import {
    getOwners,
    getOwner,
    createOwner,
    updateOwner,
    deleteOwner,
} from "../controllers/owner.controller";
import { authorize } from "../middlewares/authorize.middleware";

import { ownerValidation } from "../validators/owner.validator";
import { handleValidationErrors } from "../middlewares/validate-express";

const router = express.Router();

// Only admins can manage owners
router.get("/", authorize("admin"), getOwners);
router.get("/:id", authorize("admin"), getOwner);
router.post("/", authorize("admin"), ownerValidation, handleValidationErrors, createOwner);
router.patch("/:id", authorize("admin"), ownerValidation, handleValidationErrors, updateOwner);
router.put("/:id", authorize("admin"), ownerValidation, handleValidationErrors, updateOwner);
router.delete("/:id", authorize("admin"), deleteOwner);

export default router;
