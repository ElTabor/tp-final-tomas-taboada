import { Request, Response, NextFunction } from "express";
import * as recordService from "../services/medicalRecord.service";
import AppError from "../utils/AppError";

export const getMedicalRecords = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filter: any = {};
        if (req.query.petId) filter.petId = req.query.petId;
        if (req.query.veterinarianId) filter.veterinarianId = req.query.veterinarianId;

        const medicalRecords = await recordService.findAll(filter);
        res.status(200).json(medicalRecords);
    } catch (error) {
        next(error);
    }
};

export const getMedicalRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const medicalRecord = await recordService.findById(req.params.id as string);
        if (!medicalRecord) {
            return next(new AppError("Medical record not found", 404));
        }
        res.status(200).json(medicalRecord);
    } catch (error) {
        next(error);
    }
};

export const createMedicalRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const medicalRecord = await recordService.create(req.body);
        res.status(201).json(medicalRecord);
    } catch (error) {
        next(error);
    }
};

export const updateMedicalRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const medicalRecord = await recordService.update(req.params.id as string, req.body);
        if (!medicalRecord) {
            return next(new AppError("Medical record not found", 404));
        }
        res.status(200).json(medicalRecord);
    } catch (error) {
        next(error);
    }
};

export const deleteMedicalRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const medicalRecord = await recordService.remove(req.params.id as string);
        if (!medicalRecord) {
            return next(new AppError("Medical record not found", 404));
        }
        res.status(200).json({ message: "Medical record deleted successfully" });
    } catch (error) {
        next(error);
    }
};
