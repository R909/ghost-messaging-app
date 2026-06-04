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
      identifier: { label: "Email or Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;
        await DBConnection();
        try {
          const user = await User.findOne({
                $or: [
                    { email: credentials.identifier },
                    { username: credentials.identifier },
                ]
            });
            if (!user) {
                throw new Error("No account found with that email or username");
            }
            if (!user.isVerified) {
                throw new Error("Please verify your account before signing in");
            }
            const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
            if (!isPasswordMatch) {
                throw new Error("Incorrect password");
            }
            return {
                id: user._id.toString(),
                _id: user._id.toString(),
                email: user.email,
                username: user.username,
                isVerified: user.isVerified,
                isAcceptingMessages: user.isAcceptingMessages,
            };
        } catch (error: unknown) {
            throw new Error(error instanceof Error ? error.message : "Authentication failed");
        }
    },
  }),
],

session: {
  strategy: "jwt",
},

pages: {
  signIn: "/sign-in",
},

callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token._id = user._id?.toString();
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

secret: process.env.NEXTAUTH_SECRET,
}
