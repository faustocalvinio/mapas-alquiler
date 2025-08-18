import { NextRequest, NextResponse } from 'next/server'

// Función para geocoding usando Nominatim
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; fullAddress: string } | null> {
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ' Madrid')}&format=json&limit=1&addressdetails=1`
        console.log('Realizando petición a Nominatim:', url)

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'MapasAlquiler/1.0 (contacto@mapasalquiler.com)' // Reemplaza con tu email
            }
        })

        if (!response.ok) {
            console.error('Error en respuesta de Nominatim:', response.status, response.statusText)
            return null
        }

        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
            console.error('Respuesta no es JSON:', contentType)
            const text = await response.text()
            console.error('Contenido de respuesta:', text.substring(0, 200))
            return null
        }

        const data = await response.json()
        console.log('Datos recibidos de Nominatim:', data)

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
