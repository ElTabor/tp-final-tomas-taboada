import { Request, Response, NextFunction } from "express";
import * as vetService from "../services/veterinarian.service";
import AppError from "../utils/AppError";

export const getVeterinarians = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const veterinarians = await vetService.findAll();
        res.status(200).json(veterinarians);
    } catch (error) {
        next(error);
    }
};

export const getVeterinarian = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const veterinarian = await vetService.findById(req.params.id as string);
        if (!veterinarian) {
            return next(new AppError("Veterinarian not found", 404));
        }
        res.status(200).json(veterinarian);
    } catch (error) {
        next(error);
    }
};

export const createVeterinarian = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const veterinarian = await vetService.create(req.body);
        res.status(201).json(veterinarian);
    } catch (error) {
        next(error);
    }
};

export const updateVeterinarian = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const veterinarian = await vetService.update(req.params.id as string, req.body);
        if (!veterinarian) {
            return next(new AppError("Veterinarian not found", 404));
        }
        res.status(200).json(veterinarian);
    } catch (error) {
        next(error);
    }
};

export const deleteVeterinarian = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const veterinarian = await vetService.remove(req.params.id as string);
        if (!veterinarian) {
            return next(new AppError("Veterinarian not found", 404));
        }
        res.status(200).json({ message: "Veterinarian deleted successfully" });
    } catch (error) {
        next(error);
    }
};
