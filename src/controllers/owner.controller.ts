import { Request, Response, NextFunction } from "express";
import * as ownerService from "../services/owner.service";
import AppError from "../utils/AppError";

export const getOwners = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const owners = await ownerService.findAll();
        res.status(200).json(owners);
    } catch (error) {
        next(error);
    }
};

export const getOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const owner = await ownerService.findById(req.params.id as string);
        if (!owner) {
            return next(new AppError("Owner not found", 404));
        }
        res.status(200).json(owner);
    } catch (error) {
        next(error);
    }
};

export const createOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const owner = await ownerService.create(req.body);
        res.status(201).json(owner);
    } catch (error) {
        next(error);
    }
};

export const updateOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const owner = await ownerService.update(req.params.id as string, req.body);
        if (!owner) {
            return next(new AppError("Owner not found", 404));
        }
        res.status(200).json(owner);
    } catch (error) {
        next(error);
    }
};

export const deleteOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const owner = await ownerService.remove(req.params.id as string);
        if (!owner) {
            return next(new AppError("Owner not found", 404));
        }
        res.status(200).json({ message: "Owner, pets, and medical history deleted successfully" });
    } catch (error) {
        next(error);
    }
};
