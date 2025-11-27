import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();

        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@budget.gov',
            password: 'password123',
            role: 'admin',
            department: 'Administration'
        });

        console.log('Data Imported!');
        console.log(`Admin User Created: ${adminUser.email} / password123`);
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
