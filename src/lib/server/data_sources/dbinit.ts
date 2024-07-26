import { env } from '$env/dynamic/private'
import mongoose from 'mongoose';

const MONGO_URI = env.MONGO_URI

export const connectDB = async () => {
    console.log(`[INFO] connecting to db...`);

    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.info(`[INFO] successfully connected to mongoDB: ${conn.connection.name}`);
    } catch (error) {
        console.error(`[ERROR] failed connection to DB`, error);
    }
};
