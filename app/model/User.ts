import mongoose ,{Schema,Document}  from "mongoose";

export interface User extends Document {
    username: string;
    password: string;
    email: string;
    verifyCode: string;
    verifyCodeExpire: Date;
    isAcceptingMessages: boolean;
    isVerified: boolean;
    messages: string[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<User>({
    username: { type: String, required: [true, 'Username is required'],trim:true },
    password: { type: String, required: [true, 'Password is required'],trim:true },
    email: { type: String, required: [true, 'Email is required'],trim:true,unique:true,match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please enter a valid email address'] },
    verifyCode: { type: String ,trim:true},
    verifyCodeExpire: { type: Date,trim:true },
    isAcceptingMessages: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    messages: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  export const User = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);