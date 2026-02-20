import mongoose, { Schema, Document } from "mongoose";

export interface IOwner extends Document {
    fullName: string;
    phone: string;
    address?: string;
}

const ownerSchema: Schema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
}, { timestamps: true });

export default mongoose.model<IOwner>("Owner", ownerSchema);
