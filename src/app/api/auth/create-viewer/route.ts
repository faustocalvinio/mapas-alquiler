import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Solo usuarios autorizados de Google pueden crear usuarios viewer
        if (!session?.user?.isAuthorized || session.user.userType !== "google") {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const { email, password, name } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email y contraseña son requeridos" },
                { status: 400 }
            );
        }

        // Verificar si ya existe un usuario con ese email
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Ya existe un usuario con ese email" },
                { status: 400 }
            );
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 12);

        // Crear el usuario viewer usando SQL directo
        const newUser = await prisma.$queryRaw`
            INSERT INTO "User" (id, email, password, name, "userType", "isAuthorized", "emailVerified")
            VALUES (
                gen_random_uuid()::text,
                ${email},
                ${hashedPassword},
                ${name || "Usuario Viewer"},
                'viewer',
                true,
                null
            )
            RETURNING id, email, name, "userType"
        ` as any[];

        return NextResponse.json({
            success: true,
            message: "Usuario viewer creado exitosamente",
            user: {
                id: newUser[0].id,
                email: newUser[0].email,
                name: newUser[0].name,
                userType: newUser[0].userType
            }
        });

    } catch (error) {
        console.error("Error creando usuario viewer:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}