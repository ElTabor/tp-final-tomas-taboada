import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPet extends Document {
    name: string;
    species: string;
    birthDate?: Date;
    ownerId: Types.ObjectId;
}

const petSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    species: {
        type: String,
        required: true,
    },
    birthDate: {
        type: Date,
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "Owner",
        required: true,
    },
}, { timestamps: true });

export default mongoose.model<IPet>("Pet", petSchema);
