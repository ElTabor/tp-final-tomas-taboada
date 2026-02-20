import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMedicalRecord extends Document {
    petId: Types.ObjectId;
    veterinarianId: Types.ObjectId;
    date: Date;
    time: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const medicalRecordSchema: Schema = new Schema({
    petId: {
        type: Schema.Types.ObjectId,
        ref: "Pet",
        required: true,
    },
    veterinarianId: {
        type: Schema.Types.ObjectId,
        ref: "Veterinarian",
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    time: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model<IMedicalRecord>("MedicalRecord", medicalRecordSchema);
