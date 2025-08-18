import { NextRequest, NextResponse } from 'next/server'

// Función para geocoding usando Nominatim
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; fullAddress: string } | null> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ' Madrid')}&format=json&limit=1&addressdetails=1`
        )
        const data = await response.json()

        if (data && data.length > 0) {
            const result = data[0]
            return {
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon),
                fullAddress: result.display_name
            }
        }
        return null
    } catch (error) {
        console.error('Error en validación de dirección:', error)
        return null
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { address } = body

        if (!address) {
            return NextResponse.json(
                { error: 'Dirección es requerida' },
                { status: 400 }
            )
        }

        const coordinates = await geocodeAddress(address)

        if (!coordinates) {
            return NextResponse.json(
                {
                    valid: false,
                    error: 'No se pudo encontrar la dirección. Verifica que sea una dirección válida en Madrid.'
                },
                { status: 200 }
            )
        }

        return NextResponse.json({
            valid: true,
            coordinates: {
                lat: coordinates.lat,
                lng: coordinates.lng
            },
            fullAddress: coordinates.fullAddress
        })
    } catch (error) {
        console.error('Error validando dirección:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
