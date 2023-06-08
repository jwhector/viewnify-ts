import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "email", type: "email", placeholder: "jsmith@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const payload = {
                    email: credentials?.email,
                    password: credentials?.password
                }
                const res = 
                    await fetch(`http://localhost:3005/api/users/login`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    });

                const user = await res.json();
                console.log("user: ", user);
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
        async jwt({ token, user, account }) {
            if (account) console.log("account: ", account);
            if (user) console.log("jwt user: ", user);
            if (user) {
                token.user = user;
            }
            console.log("jwt token cb: ", token);
            return token;
        },

        async session({ session, token }) {
            if (token.user) {
                session.user = token.user;
            }
            console.log("session: ", session);
            return session;
        }
    }
});

export { handler as GET, handler as POST }