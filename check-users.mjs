import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    console.log("Registered Users:", users.map(u => ({ email: u.email, auth: u.authProvider })));
    process.exit(0);
}
check();
