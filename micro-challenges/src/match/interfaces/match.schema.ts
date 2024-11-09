import mongoose from 'mongoose';

export const MatchSchema = new mongoose.Schema(
  {
    category: { type: String },
    challenge: { type: mongoose.Schema.ObjectId },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    def: { type: mongoose.Schema.Types.ObjectId },
    result: [
      {
        set: { type: String },
      },
    ],
  },
  { timestamps: true, collection: 'matches' },
);
