import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITypingResult extends Document {
    user: mongoose.Types.ObjectId;
    challengeType: string;
    wpm: number;
    accuracy: number;
    timeTaken: number;
    missedChars?: Map<string, number>;
    missedWords?: Map<string, number>;
    createdAt: Date;
    updatedAt: Date;
}

const TypingResultSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        challengeType: {
            type: String,
            required: true,
            enum: ['standard', 'paragraph', 'developer', 'daily'],
        },
        wpm: {
            type: Number,
            required: true,
        },
        accuracy: {
            type: Number,
            required: true,
        },
        timeTaken: {
            type: Number,
            required: true,
        },
        missedChars: {
            type: Map,
            of: Number,
            default: {},
        },
        missedWords: {
            type: Map,
            of: Number,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

export const TypingResult: Model<ITypingResult> =
    mongoose.models.TypingResult ||
    mongoose.model<ITypingResult>('TypingResult', TypingResultSchema);
