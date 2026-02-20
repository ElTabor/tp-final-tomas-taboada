import { body } from "express-validator";

export const medicalRecordValidation = [
    body("petId")
        .notEmpty().withMessage("Pet ID is required")
        .isMongoId().withMessage("Invalid Pet ID format"),
    body("veterinarianId")
        .notEmpty().withMessage("Veterinarian ID is required")
        .isMongoId().withMessage("Invalid Veterinarian ID format"),
    body("date")
        .notEmpty().withMessage("Date is required")
        .isISO8601().withMessage("Date must be in ISO 8601 format (YYYY-MM-DD)"),
    body("time")
        .notEmpty().withMessage("Time is required")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("Time must be in HH:MM format"),
    body("description")
        .trim()
        .notEmpty().withMessage("Description is required")
        .isLength({ min: 5 }).withMessage("Description must be at least 5 characters long"),
];
