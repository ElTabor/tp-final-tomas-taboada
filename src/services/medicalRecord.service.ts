import MedicalRecord, { IMedicalRecord } from "../models/medicalRecord.model";
import { CreateMedicalRecordDTO, UpdateMedicalRecordDTO } from "../dtos/medicalRecord.dto";
import AppError from "../utils/AppError";

const validateTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes < 9 * 60 || totalMinutes > 17 * 60 || (minutes !== 0 && minutes !== 30)) {
        throw new AppError("Invalid appointment time. Must be between 09:00-17:00 in 30-min blocks.", 400);
    }
};

export const findAll = async (filter: any = {}): Promise<IMedicalRecord[]> => {
    return await MedicalRecord.find(filter)
        .populate("petId")
        .populate("veterinarianId");
};

export const findById = async (id: string): Promise<IMedicalRecord | null> => {
    return await MedicalRecord.findById(id)
        .populate("petId")
        .populate("veterinarianId");
};

export const create = async (data: CreateMedicalRecordDTO): Promise<IMedicalRecord> => {
    if (data.time) {
        validateTime(data.time);
    }
    let record = await MedicalRecord.create(data);
    return await record.populate(["petId", "veterinarianId"]);
};

export const update = async (id: string, data: UpdateMedicalRecordDTO): Promise<IMedicalRecord | null> => {
    if (data.time) {
        validateTime(data.time);
    }
    return await MedicalRecord.findByIdAndUpdate(id, data, { new: true })
        .populate("petId")
        .populate("veterinarianId");
};

export const remove = async (id: string): Promise<IMedicalRecord | null> => {
    return await MedicalRecord.findByIdAndDelete(id);
};
