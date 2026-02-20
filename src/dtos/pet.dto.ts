import { Types } from "mongoose";

export interface CreatePetDTO {
    name: string;
    species: string;
    birthDate?: Date;
    ownerId: string | Types.ObjectId;
}

export interface UpdatePetDTO {
    name?: string;
    species?: string;
    birthDate?: Date;
    ownerId?: string | Types.ObjectId;
}
