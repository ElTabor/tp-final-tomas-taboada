import { body } from "express-validator";

export const petValidation = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),
    body("species")
        .trim()
        .notEmpty().withMessage("Species is required"),
    body("birthDate")
        .optional()
        .isISO8601().withMessage("Birth date must be a valid date (ISO 8601 format)"),
    body("ownerId")
        .notEmpty().withMessage("Owner ID is required")
        .isMongoId().withMessage("Invalid Owner ID format"),
];
