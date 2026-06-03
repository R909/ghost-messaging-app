import mongoose ,{Schema,Document}  from "mongoose";
export interface Message extends Document {
    content: string;
    CreatedAt: Date;
}

const MessageSchema = new Schema<Message>({
    content: { type: String, required: [true, 'Message is required'],trim:true },
    CreatedAt: { type: Date, default: Date.now },
  });
  
  export const Message = mongoose.model<Message>('Message', MessageSchema);