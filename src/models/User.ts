import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password?: string;
    image?: string;
    authProvider: 'credentials' | 'google';
    themePreference: 'light' | 'dark' | 'system';
    unlockedAchievements: {
        achievementId: string;
        unlockedAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            select: false, // Hidden by default, only mapped via explicitly asking in login route
        },
        image: {
            type: String,
        },
        authProvider: {
            type: String,
            enum: ['credentials', 'google'],
            default: 'credentials',
        },
        themePreference: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system',
        },
        unlockedAchievements: [
            {
                achievementId: String,
                unlockedAt: { type: Date, default: Date.now },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
