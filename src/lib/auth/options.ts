import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db/mongodb";
import User, { IUser } from "@/lib/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password");
        }

        await connectToDatabase();

        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        if (user.isBanned) {
          const banMessage = user.bannedUntil
            ? `Account banned until ${user.bannedUntil.toLocaleDateString()}`
            : "Account permanently banned";
          throw new Error(banMessage);
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Update online status
        await User.findByIdAndUpdate(user._id, {
          isOnline: true,
          lastSeen: new Date(),
        });

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.displayName,
          username: user.username,
          gender: user.gender,
          genderPreference: user.genderPreference,
          profileImage: user.profileImage,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.gender = user.gender;
        token.genderPreference = user.genderPreference;
        token.profileImage = user.profileImage;
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.genderPreference =
          session.genderPreference || token.genderPreference;
        token.profileImage = session.profileImage || token.profileImage;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.gender = token.gender as string;
        session.user.genderPreference = token.genderPreference as string;
        session.user.profileImage = token.profileImage as string | undefined;
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.id) {
        try {
          await connectToDatabase();
          await User.findByIdAndUpdate(token.id, {
            isOnline: false,
            lastSeen: new Date(),
          });
        } catch (error) {
          console.error("Error updating user status on signout:", error);
        }
      }
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
