import mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    phoneNumber: { type: String },
    name: { type: String },
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    ranking: { type: String },
    rankingPosition: { type: Number },
    urlImagePlayer: { type: String },
  },
  { timestamps: true, collection: 'players' },
);
