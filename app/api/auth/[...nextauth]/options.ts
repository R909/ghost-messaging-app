import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import DBConnection from "@/app/lib/dbConnect";
import { User } from "@/app/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
  CredentialsProvider({
    id: "credentials",
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials:any):Promise<any> {
        await DBConnection();
        try{
          const user =  await User.findOne({
                $or: [
                    { email: credentials?.identifier?.email },
                    { username: credentials?.identifier?.username  }
                ]
            })
            if(!user){
                throw new Error("User not found");
            }
            if(!user.isVerified){
                throw new Error("Please verified your account first");
            }
            const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
            if (!isPasswordMatch) {
                throw new Error("Invalid password");
            }
            return user
        }
        catch(error:any){
            throw new error(error);
        }
    },
  }),
],
pages: {
  signIn: "sign-in",
},

callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token._id = user._id;
      token.email = user.email;
      token.username = user.username;
      token.isVerified = user.isVerified;
      token.isAcceptingMessages = user.isAcceptingMessages;
    }
    return token;
  },
  async session({ session, token }) {
    if (token) {
       session.user._id = token._id as string | undefined;
       session.user.email = token.email ?? undefined;
        session.user.username = token.username as string | undefined;
        session.user.isVerified = token.isVerified as boolean | undefined;
        session.user.isAcceptingMessages =
          token.isAcceptingMessages as boolean | undefined;
    }
    return session;
  },
},

secret:  process.env.NEXTAUTH_SECRET ,
}
