import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        const locations = await prisma.location.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(locations);
    } catch (error) {
        console.error("Error al obtener ubicaciones:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        const { name, address, type, description, lat, lng, iconColor } = await request.json();

        // Validaciones básicas
        if (!name || !address || !type || lat === undefined || lng === undefined) {
            return NextResponse.json(
                { error: "Faltan campos requeridos" },
                { status: 400 }
            );
        }

        const location = await prisma.location.create({
            data: {
                name,
                address,
                type,
                description: description || null,
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                iconColor: iconColor || "#EF4444",
                userId: user.id,
            },
        });

        return NextResponse.json(location, { status: 201 });
    } catch (error) {
        console.error("Error al crear ubicación:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
