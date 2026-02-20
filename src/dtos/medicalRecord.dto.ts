import { Types } from "mongoose";

export interface CreateMedicalRecordDTO {
    petId: string | Types.ObjectId;
    veterinarianId: string | Types.ObjectId;
    date: Date;
    time: string;
    description: string;
}

export interface UpdateMedicalRecordDTO {
    petId?: string | Types.ObjectId;
    veterinarianId?: string | Types.ObjectId;
    date?: Date;
    time?: string;
    description?: string;
}
