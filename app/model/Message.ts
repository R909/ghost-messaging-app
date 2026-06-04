import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    conversationId: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    content: string;
    seen: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<Message>({
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: [true, 'Message is required'], trim: true },
    seen: { type: Boolean, default: false },
}, { timestamps: true });

MessageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message = (mongoose.models.Message as mongoose.Model<Message>) || mongoose.model<Message>('Message', MessageSchema);
