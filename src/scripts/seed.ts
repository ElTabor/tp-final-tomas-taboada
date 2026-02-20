import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Owner from '../models/owner.model';
import Pet from '../models/pet.model';
import Veterinarian from '../models/veterinarian.model';
import MedicalRecord from '../models/medicalRecord.model';
import connectDB from '../config/db';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB...');

        // Clear existing data
        console.log('Clearing existing data...');
        await Promise.all([
            Owner.deleteMany({}),
            Pet.deleteMany({}),
            Veterinarian.deleteMany({}),
            MedicalRecord.deleteMany({})
        ]);

        // 1. Create 3 Veterinarians
        console.log('Seeding Veterinarians...');
        const vetsData = [
            { fullName: 'Dr. Gregory House', licenseNumber: 'MP-1001', specialty: 'Clínica Médica' },
            { fullName: 'Dra. Dolittle', licenseNumber: 'MP-1002', specialty: 'Cirugía' },
            { fullName: 'Dr. Emmet Brown', licenseNumber: 'MP-1003', specialty: 'Traumatología' }
        ];
        const vets = await Veterinarian.create(vetsData);

        // 2. Create 7 Owners
        console.log('Seeding Owners...');
        const ownersData = [
            { fullName: 'Juan Perez', phone: '1155550001', address: 'Av. Siempre Viva 123' },
            { fullName: 'Maria Garcia', phone: '1155550002', address: 'Calle Falsa 123' },
            { fullName: 'Carlos Lopez', phone: '1155550003', address: 'Libertador 500' },
            { fullName: 'Ana Martinez', phone: '1155550004', address: 'Santa Fe 2000' },
            { fullName: 'Pedro Sanchez', phone: '1155550005', address: 'Corrientes 3000' },
            { fullName: 'Lucia Diaz', phone: '1155550006', address: 'Cordoba 4000' },
            { fullName: 'Miguel Angel', phone: '1155550007', address: 'Mitre 500' }
        ];
        const owners = await Owner.create(ownersData);

        // 3. Create 10 Pets
        console.log('Seeding Pets...');
        const speciesList = ['Perro', 'Gato', 'Conejo', 'Hamster'];
        const petNames = ['Firulais', 'Michi', 'Rex', 'Luna', 'Simba', 'Nala', 'Rocky', 'Coco', 'Thor', 'Lola'];
        const petsData = [];
        for (let i = 0; i < 10; i++) {
            petsData.push({
                name: petNames[i],
                species: speciesList[Math.floor(Math.random() * speciesList.length)],
                birthDate: new Date(2015 + Math.floor(Math.random() * 8), 0, 1),
                ownerId: owners[i % owners.length]._id
            });
        }
        const pets = await Pet.create(petsData);

        // 4. Create 10 Medical Records
        console.log('Seeding Medical Records...');
        const recordsData = [];
        const today = new Date();

        for (let i = 0; i < 10; i++) {
            // Random date between -20 and +20 days
            const daysOffset = Math.floor(Math.random() * 41) - 20;
            const date = new Date(today);
            date.setDate(today.getDate() + daysOffset);

            // Random business hour 09:00 - 17:00
            const hour = 9 + Math.floor(Math.random() * 9);
            // Avoid 17:30 etc if closing is 17:00. Let's say 17:00 is fine as last slot or maybe up to 16:30. 
            // The validation says 09:00 to 17:00. 17:00 is usually the end.
            // Let's safe pick 09 to 16.
            const safeHour = hour > 16 ? 16 : hour;
            const minute = Math.random() < 0.5 ? '00' : '30';
            const time = `${safeHour.toString().padStart(2, '0')}:${minute}`;

            recordsData.push({
                petId: pets[i % pets.length]._id,
                veterinarianId: vets[i % vets.length]._id,
                date: date,
                time: time,
                description: `Estado general: bueno.`
            });
        }
        await MedicalRecord.create(recordsData);

        console.log('✅ Database populated successfully!');
        console.log(`- ${vets.length} Veterinarians`);
        console.log(`- ${owners.length} Owners`);
        console.log(`- ${pets.length} Pets`);
        console.log(`- ${recordsData.length} Medical Records`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
