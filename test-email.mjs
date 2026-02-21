import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    secure: process.env.EMAIL_SERVER_PORT === '465', // true for 465, false for 587
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

async function test() {
    try {
        console.log("Verifying connection to:", process.env.EMAIL_SERVER_HOST);
        await transporter.verify();
        console.log("Server is ready to take our messages");

        console.log("Attempting to send a test email...");
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_FROM, // Send to self
            subject: "Test Email from Keysprint",
            text: "This is a test email.",
        });

        console.log("Message sent to self: %s", info.messageId);
    } catch (error) {
        console.error("Error connecting or sending:", error);
    }
}

test();
