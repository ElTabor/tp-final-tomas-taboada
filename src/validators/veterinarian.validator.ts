import { body } from "express-validator";

export const veterinarianValidation = [
    body("fullName")
        .trim()
        .notEmpty().withMessage("Full name is required")
        .isLength({ min: 3 }).withMessage("Full name must be at least 3 characters long"),
    body("licenseNumber")
        .trim()
        .notEmpty().withMessage("License number is required"),
    body("specialty")
        .trim()
        .notEmpty().withMessage("Specialty is required"),
];
