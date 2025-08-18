import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Función para geocoding usando Nominatim
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ' Madrid')}&format=json&limit=1`
        console.log('Realizando petición a Nominatim para apartamento:', url)

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
        console.log('Datos recibidos de Nominatim para apartamento:', data)

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            }
        }
        return null
    } catch (error) {
        console.error('Error en geocoding:', error)
        return null
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const zone = searchParams.get('zone')

        const whereClause: Record<string, unknown> = {}

        if (minPrice || maxPrice) {
            const priceFilter: Record<string, number> = {}
            if (minPrice) priceFilter.gte = parseInt(minPrice)
            if (maxPrice) priceFilter.lte = parseInt(maxPrice)
            whereClause.price = priceFilter
        }
        if (zone) whereClause.zone = { contains: zone, mode: 'insensitive' }

        const apartments = await prisma.apartment.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(apartments)
    } catch (error) {
        console.error('Error obteniendo apartamentos:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { address, price, zone, title, notes } = body

        // Validación
        if (!address || !price) {
            return NextResponse.json(
                { error: 'Dirección y precio son requeridos' },
                { status: 400 }
            )
        }

        if (price <= 0) {
            return NextResponse.json(
                { error: 'El precio debe ser mayor a 0' },
                { status: 400 }
            )
        }

        // Geocoding
        const coordinates = await geocodeAddress(address)
        if (!coordinates) {
            return NextResponse.json(
                { error: 'No se pudo encontrar la dirección. Verifica que sea una dirección válida en Madrid.' },
                { status: 400 }
            )
        }

        // Crear apartamento
        const apartment = await prisma.apartment.create({
            data: {
                title: title || null,
                address,
                price: parseInt(price),
                zone: zone || null,
                notes: notes || null,
                lat: coordinates.lat,
                lng: coordinates.lng
            }
        })

        return NextResponse.json(apartment, { status: 201 })
    } catch (error) {
        console.error('Error creando apartamento:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'ID del apartamento es requerido' },
                { status: 400 }
            )
        }

        await prisma.apartment.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Apartamento eliminado correctamente' })
    } catch (error) {
        console.error('Error eliminando apartamento:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'ID del apartamento es requerido' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { address, price, zone, title, notes } = body

        // Validación
        if (!address || !price) {
            return NextResponse.json(
                { error: 'Dirección y precio son requeridos' },
                { status: 400 }
            )
        }

        if (price <= 0) {
            return NextResponse.json(
                { error: 'El precio debe ser mayor a 0' },
                { status: 400 }
            )
        }

        // Verificar si el apartamento existe
        const existingApartment = await prisma.apartment.findUnique({
            where: { id }
        })

        if (!existingApartment) {
            return NextResponse.json(
                { error: 'Apartamento no encontrado' },
                { status: 404 }
            )
        }

        // Solo hacer geocoding si la dirección cambió
        let coordinates = { lat: existingApartment.lat, lng: existingApartment.lng }
        if (address !== existingApartment.address) {
            const newCoordinates = await geocodeAddress(address)
            if (!newCoordinates) {
                return NextResponse.json(
                    { error: 'No se pudo encontrar la dirección. Verifica que sea una dirección válida en Madrid.' },
                    { status: 400 }
                )
            }
            coordinates = newCoordinates
        }

        // Actualizar apartamento
        const updatedApartment = await prisma.apartment.update({
            where: { id },
            data: {
                title: title || null,
                address,
                price: parseInt(price),
                zone: zone || null,
                notes: notes || null,
                lat: coordinates.lat,
                lng: coordinates.lng
            }
        })

        return NextResponse.json(updatedApartment)
    } catch (error) {
        console.error('Error actualizando apartamento:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
