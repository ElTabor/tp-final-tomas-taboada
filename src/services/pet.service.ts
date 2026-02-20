import Pet, { IPet } from "../models/pet.model";
import MedicalRecord from "../models/medicalRecord.model";
import { CreatePetDTO, UpdatePetDTO } from "../dtos/pet.dto";

export const findAll = async (filter: any = {}): Promise<IPet[]> => {
    return await Pet.find(filter).populate("ownerId");
};

export const findById = async (id: string): Promise<IPet | null> => {
    return await Pet.findById(id).populate("ownerId");
};

export const create = async (data: CreatePetDTO): Promise<IPet> => {
    let pet = await Pet.create(data);
    return await pet.populate("ownerId");
};

export const update = async (id: string, data: UpdatePetDTO): Promise<IPet | null> => {
    return await Pet.findByIdAndUpdate(id, data, { new: true }).populate("ownerId");
};

export const remove = async (id: string): Promise<IPet | null> => {
    const pet = await Pet.findByIdAndDelete(id);
    if (pet) {
        // Cascade delete medical records
        await MedicalRecord.deleteMany({ petId: id });
    }
    return pet;
};
