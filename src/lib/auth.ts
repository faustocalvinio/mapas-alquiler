import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

const authorizedEmails = process.env.AUTHORIZED_EMAILS?.split(",").map(email => email.trim()) || [];

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            // Solo verificar autorización para Google OAuth
            if (account?.provider === "google" && user.email) {
                const isAuthorized = authorizedEmails.includes(user.email);
                console.log(`Email: ${user.email}, Authorized: ${isAuthorized}`);
                console.log(`Authorized emails: ${authorizedEmails.join(", ")}`);

                if (!isAuthorized) {
                    console.log(`Access denied for: ${user.email}`);
                    return "/auth/error?error=AccessDenied";
                }

                console.log(`Access granted for: ${user.email}`);
                return true;
            }
            return true;
        },
        async session({ session, user }) {
            if (session.user && user) {
                session.user.id = user.id;
                // Verificar si el email está autorizado
                const isAuthorized = session.user.email ? authorizedEmails.includes(session.user.email) : false;
                session.user.isAuthorized = isAuthorized;

                console.log(`Session for ${session.user.email}: authorized = ${isAuthorized}`);
            }
            return session;
        },
    },
    session: {
        strategy: "database",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true, // Habilitar debug para más información
};
