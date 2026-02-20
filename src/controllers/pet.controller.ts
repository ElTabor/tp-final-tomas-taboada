import { Request, Response, NextFunction } from "express";
import * as petService from "../services/pet.service";
import AppError from "../utils/AppError";

export const getPets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filter: any = {};
        if (req.query.ownerId) filter.ownerId = req.query.ownerId;
        if (req.query.species) filter.species = req.query.species;

        const pets = await petService.findAll(filter);
        res.status(200).json(pets);
    } catch (error) {
        next(error);
    }
};

export const getPet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pet = await petService.findById(req.params.id as string);
        if (!pet) {
            return next(new AppError("Pet not found", 404));
        }
        res.status(200).json(pet);
    } catch (error) {
        next(error);
    }
};

export const createPet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pet = await petService.create(req.body);
        res.status(201).json(pet);
    } catch (error) {
        next(error);
    }
};

export const updatePet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pet = await petService.update(req.params.id as string, req.body);
        if (!pet) {
            return next(new AppError("Pet not found", 404));
        }
        res.status(200).json(pet);
    } catch (error) {
        next(error);
    }
};

export const deletePet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pet = await petService.remove(req.params.id as string);
        if (!pet) {
            return next(new AppError("Pet not found", 404));
        }
        res.status(200).json({ message: "Pet and associated records deleted successfully" });
    } catch (error) {
        next(error);
    }
};
