import { body } from "express-validator";

export const ownerValidation = [
    body("fullName")
        .trim()
        .notEmpty().withMessage("Full name is required")
        .isLength({ min: 3 }).withMessage("Full name must be at least 3 characters long"),
    body("phone")
        .trim()
        .notEmpty().withMessage("Phone number is required")
        .isMobilePhone("any").withMessage("Invalid phone number format"),
    body("address")
        .optional()
        .trim()
        .isLength({ min: 5 }).withMessage("Address must be at least 5 characters long"),
];
