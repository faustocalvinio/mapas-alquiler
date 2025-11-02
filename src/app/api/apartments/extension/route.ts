import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Endpoint especial para la extensión de Chrome con autenticación por API Key
export async function POST(request: NextRequest) {
    try {
        // Verificar API Key en el header
        const apiKey = request.headers.get("X-API-Key");

        if (!apiKey) {
            return NextResponse.json(
                { error: "API Key requerida" },
                { status: 401 }
            );
        }

        // Buscar usuario por API Key (asumiendo que la API Key está en el campo password para usuarios viewer)
        // En producción, deberías tener un campo dedicado para API Keys
        const user = await prisma.user.findFirst({
            where: {
                password: apiKey,
                isAuthorized: true
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "API Key inválida o usuario no autorizado" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const {
            title,
            address,
            priceARS,
            currency = "ARS",
            expenses = 0,
            link,
            rooms,
            bathrooms,
            squareMeters,
            usdRate = 1500,
        } = body;

        // Validaciones básicas
        if (!address) {
            return NextResponse.json(
                { error: "Dirección es requerida" },
                { status: 400 }
            );
        }

        if (!priceARS || priceARS <= 0) {
            return NextResponse.json(
                { error: "Precio inválido" },
                { status: 400 }
            );
        }

        // Convertir precio y expensas a USD correctamente
        // Las expensas SIEMPRE están en ARS, incluso si el precio está en USD
        let priceUSD: number;
        let finalPriceARS: number;
        let expensesUSD = 0;

        if (currency === "USD") {
            // Si el alquiler está en USD
            priceUSD = priceARS; // priceARS en este caso es realmente USD
            finalPriceARS = priceUSD * usdRate;
        } else {
            // Si el alquiler está en ARS
            priceUSD = priceARS / usdRate;
            finalPriceARS = priceARS;
        }

        // Las expensas siempre están en ARS, convertir a USD
        if (expenses && expenses > 0) {
            expensesUSD = expenses / usdRate;
        }

        // Calcular precio total en USD (alquiler + expensas)
        const totalPriceUSD = priceUSD + expensesUSD;
        const totalPriceARS = finalPriceARS + (expenses || 0);

        // Intentar geocodificar la dirección para obtener coordenadas
        let lat = -34.6037; // Default: Buenos Aires
        let lng = -58.3816;
        let zone = null;
        let neighborhood = null;

        try {
            // Usar el endpoint de validación de dirección existente
            const geoResponse = await fetch(
                `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/validate-address`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ address }),
                }
            );

            if (geoResponse.ok) {
                const geoData = await geoResponse.json();
                if (geoData.lat && geoData.lng) {
                    lat = geoData.lat;
                    lng = geoData.lng;
                }
                if (geoData.zone) {
                    zone = geoData.zone;
                }
                if (geoData.neighborhood) {
                    neighborhood = geoData.neighborhood;
                }
            }
        } catch (error) {
            console.error("Error geocoding address:", error);
            // Continuar con coordenadas por defecto
        }

        // Verificar si ya existe un apartamento con el mismo link
        if (link) {
            const existingApartment = await prisma.apartment.findFirst({
                where: { link }
            });

            if (existingApartment) {
                return NextResponse.json(
                    {
                        message: "Apartamento ya existe",
                        apartment: existingApartment
                    },
                    { status: 200 }
                );
            }
        }

        // Crear el apartamento
        const apartment = await prisma.apartment.create({
            data: {
                title: title || null,
                address,
                priceUSD: totalPriceUSD, // Precio total en USD (alquiler + expensas)
                priceARS: totalPriceARS, // Precio total en ARS (alquiler + expensas)
                currency: "USD", // Siempre guardamos normalizado a USD
                zone,
                neighborhood,
                rooms: rooms ? parseInt(rooms.toString()) : null,
                bathrooms: bathrooms ? parseInt(bathrooms.toString()) : null,
                squareMeters: squareMeters ? parseFloat(squareMeters.toString()) : null,
                expenses: expenses ? parseFloat(expenses.toString()) : null,
                notes: `Importado desde ZonaProp. Precio original: ${currency === "USD" ? "USD" : "ARS"} ${priceARS.toLocaleString()}${expenses ? ` + ARS ${expenses.toLocaleString()} expensas` : ""}`,
                link,
                lat,
                lng,
                status: "available",
                iconColor: "#10b981", // Verde para propiedades de la extensión
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

        return NextResponse.json(
            {
                message: "Apartamento guardado exitosamente",
                apartment,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating apartment from extension:", error);
        return NextResponse.json(
            { error: "Error al guardar el apartamento" },
            { status: 500 }
        );
    }
}
