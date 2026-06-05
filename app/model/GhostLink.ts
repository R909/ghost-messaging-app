import mongoose, { Schema, Document } from "mongoose";

export interface GhostLink extends Document {
  userId: mongoose.Types.ObjectId;
  code: string;
  status: "active" | "hidden";
  expiresAt: Date;
  createdAt: Date;
}

const GhostLinkSchema = new Schema<GhostLink>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  code: { type: String, required: true, unique: true, trim: true },
  status: { type: String, enum: ["active", "hidden"], default: "active" },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const GhostLink =
  (mongoose.models.GhostLink as mongoose.Model<GhostLink>) ||
  mongoose.model<GhostLink>("GhostLink", GhostLinkSchema);
