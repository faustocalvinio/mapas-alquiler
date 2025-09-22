import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

const authorizedEmails = process.env.AUTHORIZED_EMAILS?.split(",").map(email => email.trim()) || [];

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    // Usar consulta SQL directa temporalmente hasta que Prisma se actualice
                    const user = await prisma.$queryRaw`
                        SELECT id, name, email, password, "userType"
                        FROM "User" 
                        WHERE email = ${credentials.email} AND "userType" = 'viewer'
                    ` as any[];

                    if (!user || user.length === 0 || !user[0].password) {
                        return null;
                    }

                    const foundUser = user[0];
                    const passwordMatch = await bcrypt.compare(credentials.password, foundUser.password);

                    if (!passwordMatch) {
                        return null;
                    }

                    return {
                        id: foundUser.id,
                        email: foundUser.email,
                        name: foundUser.name,
                        userType: foundUser.userType,
                    };
                } catch (error) {
                    console.error("Error en authorize:", error);
                    return null;
                }
            }
        }),
    ],
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            // Permitir login para usuarios viewer (credenciales)
            if (account?.provider === "credentials") {
                return true;
            }

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
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.sub as string;

                // Para usuarios de credenciales
                if (token.userType) {
                    session.user.userType = token.userType as string;
                    session.user.isAuthorized = true;
                } else {
                    // Para usuarios de Google OAuth
                    const isAuthorized = session.user.email ? authorizedEmails.includes(session.user.email) : false;
                    session.user.isAuthorized = isAuthorized;
                    session.user.userType = "google";
                }

                console.log(`Session for ${session.user.email}: authorized = ${session.user.isAuthorized}, type = ${session.user.userType}`);
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (user && (user as any).userType) {
                token.userType = (user as any).userType;
            }
            if (account?.provider === "google") {
                token.userType = "google";
            }
            return token;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
};
