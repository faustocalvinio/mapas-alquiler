import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Obtener un apartamento por ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const apartment = await prisma.apartment.findUnique({
            where: {
                id: params.id,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!apartment) {
            return NextResponse.json(
                { error: "Apartamento no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(apartment);
    } catch (error) {
        console.error("Error fetching apartment:", error);
        return NextResponse.json(
            { error: "Error al obtener el apartamento" },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar un apartamento
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user || !user.isAuthorized) {
            return NextResponse.json(
                { error: "Usuario no autorizado" },
                { status: 403 }
            );
        }

        await prisma.apartment.delete({
            where: {
                id: params.id,
            },
        });

        return NextResponse.json({ message: "Apartamento eliminado" });
    } catch (error) {
        console.error("Error deleting apartment:", error);
        return NextResponse.json(
            { error: "Error al eliminar el apartamento" },
            { status: 500 }
        );
    }
}

// PATCH - Actualizar un apartamento
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user || !user.isAuthorized) {
            return NextResponse.json(
                { error: "Usuario no autorizado" },
                { status: 403 }
            );
        }

        const body = await request.json();

        const apartment = await prisma.apartment.update({
            where: {
                id: params.id,
            },
            data: body,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json(apartment);
    } catch (error) {
        console.error("Error updating apartment:", error);
        return NextResponse.json(
            { error: "Error al actualizar el apartamento" },
            { status: 500 }
        );
    }
}
