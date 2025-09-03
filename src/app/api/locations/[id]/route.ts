import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;

        // Verificar que la ubicación pertenece al usuario
        const location = await prisma.location.findFirst({
            where: {
                id: id,
                userId: user.id,
            },
        });

        if (!location) {
            return NextResponse.json(
                { error: "Ubicación no encontrada" },
                { status: 404 }
            );
        }

        await prisma.location.delete({
            where: { id: id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error al eliminar ubicación:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
