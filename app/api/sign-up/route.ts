import { sendVerificationEmail } from "@/app/helper/sendVerificationEmail";
import bcrypt from "bcryptjs";
import {User} from "@/app/model/User";
import DBConnection from "@/app/lib/dbConnect";

export const POST = async (req: Request) => {
    await DBConnection();

    const { username, email,password } = await req.json();

    const existingUserVerifiedByUsername = await User.findOne({ username,isVerified:true });

    if (existingUserVerifiedByUsername) {
        return Response.json({
            success: false,
            message: "User already exists   ",
        });
    }
     const existingUserVerifiedByEmail = await User.findOne({ email });
    const verifiedCode = Math.floor(Math.random() * 1000000).toString();

     if(existingUserVerifiedByEmail){
        return Response.json({
         
     })}
     else{
    const hashedPassword = await bcrypt.hash(password, 10);
    const expireDate=new Date();
    expireDate.setHours(expireDate.getHours() + 1);  
     const newUser = new User({
        username,
        password: hashedPassword,
        email,
        verifyCode:verifiedCode,
        verifyCodeExpire: expireDate,
        isAcceptingMessages: false,
        isVerified: false,
        messages: [],
    });
        await newUser.save();

     }
  const sendEmailResponse = await sendVerificationEmail(username, email, verifiedCode);

   
if(!sendEmailResponse.success){
    return {
        success: false,
        message: sendEmailResponse.message,
    };
}   
    return {
        success: true,
        message: "User created successfully!. Please verify your email.",
    };
}