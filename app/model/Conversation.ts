import mongoose, { Schema, Document } from "mongoose";

export interface Conversation extends Document {
    participants: mongoose.Types.ObjectId[];
    lastMessage: string;
    lastMessageAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ConversationSchema = new Schema<Conversation>({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date, default: Date.now },
}, { timestamps: true });

ConversationSchema.index({ participants: 1, lastMessageAt: -1 });

export const Conversation = (mongoose.models.Conversation as mongoose.Model<Conversation>) || mongoose.model<Conversation>('Conversation', ConversationSchema);
