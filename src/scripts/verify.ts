import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Owner from '../models/owner.model';
import Pet from '../models/pet.model';
import Veterinarian from '../models/veterinarian.model';
import MedicalRecord from '../models/medicalRecord.model';
import connectDB from '../config/db';

dotenv.config();

const verifyData = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB...');

        const owners = await Owner.countDocuments();
        const pets = await Pet.countDocuments();
        const vets = await Veterinarian.countDocuments();
        const records = await MedicalRecord.countDocuments();

        console.log(`Owners: ${owners}`);
        console.log(`Pets: ${pets}`);
        console.log(`Veterinarians: ${vets}`);
        console.log(`MedicalRecords: ${records}`);

        if (pets > 0) {
            const samplePet = await Pet.findOne().populate('ownerId');
            console.log('Sample Pet Owner populated:', !!samplePet?.ownerId);
            console.log('Sample Pet Owner data:', samplePet?.ownerId);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyData();
