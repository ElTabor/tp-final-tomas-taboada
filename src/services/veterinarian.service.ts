import Veterinarian, { IVeterinarian } from "../models/veterinarian.model";
import { CreateVeterinarianDTO, UpdateVeterinarianDTO } from "../dtos/veterinarian.dto";

export const findAll = async (): Promise<IVeterinarian[]> => {
    return await Veterinarian.find();
};

export const findById = async (id: string): Promise<IVeterinarian | null> => {
    return await Veterinarian.findById(id);
};

export const create = async (data: CreateVeterinarianDTO): Promise<IVeterinarian> => {
    return await Veterinarian.create(data);
};

export const update = async (id: string, data: UpdateVeterinarianDTO): Promise<IVeterinarian | null> => {
    return await Veterinarian.findByIdAndUpdate(id, data, { new: true });
};

export const remove = async (id: string): Promise<IVeterinarian | null> => {
    return await Veterinarian.findByIdAndDelete(id);
};
