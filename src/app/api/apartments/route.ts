import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Constante de conversión
const USD_TO_ARS_RATE = 1500;

// GET - Obtener todos los apartamentos
export async function GET() {
    try {
        const apartments = await prisma.apartment.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Normalizar los precios si faltan
        const normalizedApartments = apartments.map((apt: any) => {
            if (!apt.priceARS && apt.priceUSD) {
                apt.priceARS = apt.priceUSD * USD_TO_ARS_RATE;
            } else if (!apt.priceUSD && apt.priceARS) {
                apt.priceUSD = apt.priceARS / USD_TO_ARS_RATE;
            }
            return apt;
        });

        return NextResponse.json(normalizedApartments);
    } catch (error) {
        console.error("Error fetching apartments:", error);
        return NextResponse.json(
            { error: "Error al obtener los apartamentos" },
            { status: 500 }
        );
    }
}

// POST - Crear un nuevo apartamento
export async function POST(request: NextRequest) {
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
                { error: "Usuario no autorizado para agregar apartamentos" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const {
            title,
            address,
            priceUSD,
            priceARS,
            currency,
            zone,
            neighborhood,
            rooms,
            bathrooms,
            squareMeters,
            expenses,
            notes,
            link,
            lat,
            lng,
            status,
            iconColor,
        } = body;

        // Validaciones
        if (!address || !lat || !lng) {
            return NextResponse.json(
                { error: "Dirección y coordenadas son requeridas" },
                { status: 400 }
            );
        }

        // Asegurar que tengamos ambos precios
        let finalPriceUSD = priceUSD;
        let finalPriceARS = priceARS;

        if (currency === "USD" && priceUSD && !priceARS) {
            finalPriceARS = priceUSD * USD_TO_ARS_RATE;
        } else if (currency === "ARS" && priceARS && !priceUSD) {
            finalPriceUSD = priceARS / USD_TO_ARS_RATE;
        }

        if (!finalPriceUSD || finalPriceUSD <= 0) {
            return NextResponse.json(
                { error: "Precio inválido" },
                { status: 400 }
            );
        }

        const apartment = await prisma.apartment.create({
            data: {
                title: title || null,
                address,
                priceUSD: finalPriceUSD,
                priceARS: finalPriceARS,
                currency: currency || "USD",
                zone: zone || null,
                neighborhood: neighborhood || null,
                rooms: rooms ? parseInt(rooms) : null,
                bathrooms: bathrooms ? parseInt(bathrooms) : null,
                squareMeters: squareMeters ? parseFloat(squareMeters) : null,
                expenses: expenses ? parseFloat(expenses) : null,
                notes: notes || null,
                link: link || null,
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                status: status || "available",
                iconColor: iconColor || "#3B82F6",
                createdBy: user.name?.split(" ")[0] || user.email.split("@")[0],
                userId: user.id,
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

        return NextResponse.json(apartment, { status: 201 });
    } catch (error) {
        console.error("Error creating apartment:", error);
        return NextResponse.json(
            { error: "Error al crear el apartamento" },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar todos los apartamentos (solo para desarrollo/testing)
export async function DELETE() {
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

        await prisma.apartment.deleteMany({});

        return NextResponse.json({ message: "Todos los apartamentos eliminados" });
    } catch (error) {
        console.error("Error deleting apartments:", error);
        return NextResponse.json(
            { error: "Error al eliminar apartamentos" },
            { status: 500 }
        );
    }
}
