import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { address } = await request.json();

        if (!address) {
            return NextResponse.json(
                { valid: false, error: "Dirección requerida" },
                { status: 400 }
            );
        }

        // Usar OpenStreetMap Nominatim para geocoding
        const encodedAddress = encodeURIComponent(address);
        const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

        const response = await fetch(url, {
            headers: {
                "User-Agent": "MapasAlquilerCABA/1.0",
            },
        });

        const data = await response.json();

        if (!data || data.length === 0) {
            return NextResponse.json({
                valid: false,
                error: "No se pudo encontrar la dirección",
            });
        }

        const result = data[0];

        return NextResponse.json({
            valid: true,
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            displayName: result.display_name,
        });
    } catch (error) {
        console.error("Error validating address:", error);
        return NextResponse.json(
            { valid: false, error: "Error al validar la dirección" },
            { status: 500 }
        );
    }
}
