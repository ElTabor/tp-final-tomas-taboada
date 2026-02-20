import mongoose, { Schema, Document } from "mongoose";

export interface IVeterinarian extends Document {
    fullName: string;
    licenseNumber: string;
    specialty: string;
}

const veterinarianSchema: Schema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true,
    },
    specialty: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model<IVeterinarian>("Veterinarian", veterinarianSchema);
