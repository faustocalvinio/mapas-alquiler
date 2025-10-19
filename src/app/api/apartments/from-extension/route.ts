import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Función para geocoding usando Nominatim
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ' Madrid')}&format=json&limit=1`
        console.log('Realizando petición a Nominatim:', url)

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'MapasAlquiler/1.0'
            }
        })

        if (!response.ok) {
            console.error('Error en respuesta de Nominatim:', response.status)
            return null
        }

        const data = await response.json()
        console.log('Datos recibidos de Nominatim:', data)

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

// Validar API key
async function validateApiKey(apiKey: string): Promise<{ userId: string | null; error?: string }> {
    try {
        // Buscar usuario por API key (email codificado en base64)
        const decodedEmail = Buffer.from(apiKey, 'base64').toString('utf-8')

        console.log('🔍 Validando API Key para email:', decodedEmail)

        const user = await prisma.user.findUnique({
            where: { email: decodedEmail }
        })

        if (!user) {
            console.log('❌ Usuario no encontrado:', decodedEmail)
            return {
                userId: null,
                error: `Usuario no encontrado con email: ${decodedEmail}. Primero inicia sesión en la aplicación.`
            }
        }

        if (!user.isAuthorized) {
            console.log('❌ Usuario no autorizado:', decodedEmail)
            return {
                userId: null,
                error: `Usuario ${decodedEmail} no autorizado. Ejecuta: node scripts/authorize-user.js ${decodedEmail}`
            }
        }

        console.log('✅ Usuario validado:', user.email)
        return { userId: user.id }
    } catch (error) {
        console.error('Error validando API key:', error)
        return {
            userId: null,
            error: 'Error al decodificar API Key. Asegúrate de que sea un email válido en base64.'
        }
    }
}

export async function POST(request: NextRequest) {
    try {
        // Validar API key desde headers
        const apiKey = request.headers.get('x-api-key')

        if (!apiKey) {
            return NextResponse.json(
                { error: 'API key requerida. Proporciona x-api-key en los headers.' },
                { status: 401 }
            )
        }

        const validation = await validateApiKey(apiKey)

        if (!validation.userId) {
            return NextResponse.json(
                { error: validation.error || 'API key inválida o usuario no autorizado' },
                { status: 403 }
            )
        }

        const userId = validation.userId

        const body = await request.json()
        const {
            title,
            address,
            price,
            zone,
            notes,
            link,
            status = 'available',
            iconColor = '#3B82F6'
        } = body

        // Validación
        if (!address || !price) {
            return NextResponse.json(
                { error: 'Dirección y precio son requeridos' },
                { status: 400 }
            )
        }

        const priceNumber = typeof price === 'string' ? parseInt(price.replace(/\D/g, '')) : price

        if (priceNumber <= 0 || isNaN(priceNumber)) {
            return NextResponse.json(
                { error: 'El precio debe ser un número válido mayor a 0' },
                { status: 400 }
            )
        }

        // Validar estado
        if (status && !['available', 'rented'].includes(status)) {
            return NextResponse.json(
                { error: 'El estado debe ser "available" o "rented"' },
                { status: 400 }
            )
        }

        // Validar color (formato hex)
        if (iconColor && !/^#[0-9A-F]{6}$/i.test(iconColor)) {
            return NextResponse.json(
                { error: 'El color debe estar en formato hexadecimal (ej: #FF5733)' },
                { status: 400 }
            )
        }

        // Geocoding
        const coordinates = await geocodeAddress(address)
        if (!coordinates) {
            return NextResponse.json(
                { error: 'No se pudo geocodificar la dirección. Verifica que sea válida.' },
                { status: 400 }
            )
        }

        // Obtener información del usuario
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuario'

        // Crear apartamento
        const apartment = await prisma.apartment.create({
            data: {
                title: title || null,
                address,
                price: priceNumber,
                zone: zone || null,
                notes: notes || null,
                link: link || null,
                status,
                iconColor,
                lat: coordinates.lat,
                lng: coordinates.lng,
                createdBy: firstName,
                userId
            }
        })

        return NextResponse.json({
            success: true,
            apartment,
            message: 'Apartamento creado exitosamente'
        }, { status: 201 })
    } catch (error) {
        console.error('Error creando apartamento desde extensión:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

// Endpoint para verificar la API key
export async function GET(request: NextRequest) {
    try {
        const apiKey = request.headers.get('x-api-key')

        if (!apiKey) {
            return NextResponse.json(
                { valid: false, error: 'API key requerida' },
                { status: 401 }
            )
        }

        const validation = await validateApiKey(apiKey)

        if (!validation.userId) {
            return NextResponse.json(
                { valid: false, error: validation.error || 'API key inválida' },
                { status: 403 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { id: validation.userId },
            select: {
                name: true,
                email: true
            }
        })

        return NextResponse.json({
            valid: true,
            user
        })
    } catch (error) {
        console.error('Error validando API key:', error)
        return NextResponse.json(
            { valid: false, error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
