import Owner, { IOwner } from "../models/owner.model";
import Pet from "../models/pet.model";
import MedicalRecord from "../models/medicalRecord.model";
import { CreateOwnerDTO, UpdateOwnerDTO } from "../dtos/owner.dto";

export const findAll = async (): Promise<IOwner[]> => {
    return await Owner.find();
};

export const findById = async (id: string): Promise<IOwner | null> => {
    return await Owner.findById(id);
};

export const create = async (data: CreateOwnerDTO): Promise<IOwner> => {
    return await Owner.create(data);
};

export const update = async (id: string, data: UpdateOwnerDTO): Promise<IOwner | null> => {
    return await Owner.findByIdAndUpdate(id, data, { new: true });
};

export const remove = async (id: string): Promise<IOwner | null> => {
    // 1. Find all pets belonging to this owner
    const pets = await Pet.find({ ownerId: id });
    const petIds = pets.map(p => p._id);

    // 2. Cascade delete medical records for those pets
    if (petIds.length > 0) {
        await MedicalRecord.deleteMany({ petId: { $in: petIds } });
    }

    // 3. Cascade delete pets
    await Pet.deleteMany({ ownerId: id });

    // 4. Delete owner
    return await Owner.findByIdAndDelete(id);
};
