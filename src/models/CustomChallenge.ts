import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IReview {
    user: mongoose.Types.ObjectId;
    username: string; // Storing username for easier population
    rating: 'Easy' | 'Medium' | 'Hard';
    comment: string;
    createdAt: Date;
}

export interface ICustomChallenge extends Document {
    title: string;
    content: string;
    creator: mongoose.Types.ObjectId;
    creatorName: string; // Storing name for easier display
    reviews: IReview[];
    averageDifficulty: 'Unrated' | 'Easy' | 'Medium' | 'Hard';
    playCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    rating: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const customChallengeSchema = new Schema<ICustomChallenge>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    creatorName: { type: String, required: true },
    reviews: [reviewSchema],
    averageDifficulty: { type: String, enum: ['Unrated', 'Easy', 'Medium', 'Hard'], default: 'Unrated' },
    playCount: { type: Number, default: 0 },
}, {
    timestamps: true
});

// Avoid OverwriteModelError in Next.js HMR
export const CustomChallenge: Model<ICustomChallenge> = mongoose.models.CustomChallenge || mongoose.model<ICustomChallenge>('CustomChallenge', customChallengeSchema);
