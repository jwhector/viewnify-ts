import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import type { User as UserDB } from "./typedefs";

declare module "next-auth" {
    interface Session {
        user?: {
            id: string
        } & DefaultSession["user"]
    }

    interface User extends UserDB {}
}

declare module "next-auth/jwt" {
    interface JWT {
       user?: UserDB 
    }
}