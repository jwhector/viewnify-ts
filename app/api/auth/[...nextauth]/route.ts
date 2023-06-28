import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "@/types/typedefs";
import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";

interface UserToken extends JWT {
    user: User;
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "email", type: "email", placeholder: "jsmith@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const payload = {
                    email: credentials?.email,
                    password: credentials?.password
                }
                const res = 
                    await fetch(`http://localhost:3000/api/user/login`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    });

                const user: User = await res.json();
                if (res.status === 401) throw new Error("Invalid username or password.");
                if (!res.ok) {
                    throw new Error(user.error);
                }
                if (res.ok && user) {
                    return user;
                }
                return null;
                },
        })
    ],
    pages: {
        signIn: "/",
        error: "/"
    },
    secret: process.env.JWT_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user as unknown as User;
            }
            return token;
        },

        async session({ session, token }) {
            if (token.user && session.user) {
                session.user.id = token.user.id;
            }
            return session;
        }
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }