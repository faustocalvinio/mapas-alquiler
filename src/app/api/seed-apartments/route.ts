import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Función para geocoding usando Nominatim
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ' Madrid')}&format=json&limit=1`
        console.log('Geocoding:', address)

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'MapasAlquiler/1.0 (contacto@mapasalquiler.com)'
            }
        })

        if (!response.ok) {
            console.error('Error en geocoding:', response.status)
            return null
        }

        const data = await response.json()

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

// Datos de apartamentos de ejemplo distribuidos por distritos de Madrid
const seedApartments = [
    // Centro
    {
        title: "Ático luminoso en el corazón de Madrid",
        address: "Calle Mayor 50, Madrid",
        price: 2800,
        zone: "Sol",
        notes: "Espectacular ático con terraza y vistas panorámicas. Completamente renovado, ubicado en una de las calles más emblemáticas de Madrid. Ideal para ejecutivos o parejas que buscan vivir en el centro histórico.",
        status: "available",
        iconColor: "#FF6B6B",
        createdBy: "Ana García"
    },
    {
        title: "Estudio moderno cerca de Puerta del Sol",
        address: "Calle Arenal 15, Madrid",
        price: 1200,
        zone: "Sol",
        notes: "Estudio completamente amueblado en edificio histórico rehabilitado. Perfecto para estudiantes o profesionales. A 2 minutos andando de Sol y Gran Vía.",
        status: "rented",
        iconColor: "#4ECDC4",
        createdBy: "Carlos Mendez"
    },
    {
        title: "Apartamento vintage en La Latina",
        address: "Calle Toledo 85, Madrid",
        price: 1650,
        zone: "La Latina",
        notes: "Precioso apartamento de 2 habitaciones con elementos originales conservados. Suelos de madera noble, techos altos y balcón a la calle. Zona llena de vida y tapas tradicionales.",
        status: "available",
        iconColor: "#45B7D1",
        createdBy: "María López"
    },

    // Salamanca
    {
        title: "Piso de lujo en Salamanca",
        address: "Calle Serrano 120, Madrid",
        price: 3500,
        zone: "Salamanca",
        notes: "Elegante apartamento de 3 habitaciones en la zona más exclusiva de Madrid. Portero físico, aire acondicionado, cocina de diseño. Rodeado de las mejores boutiques y restaurantes.",
        status: "available",
        iconColor: "#F39C12",
        createdBy: "Eduardo Ruiz"
    },
    {
        title: "Apartamento familiar en Goya",
        address: "Calle Goya 45, Madrid",
        price: 2400,
        zone: "Goya",
        notes: "Espacioso piso de 4 habitaciones ideal para familias. Reformado recientemente, con dos baños completos y amplio salón. Muy cerca del metro Goya y del Retiro.",
        status: "available",
        iconColor: "#9B59B6",
        createdBy: "Isabel Fernández"
    },

    // Chamberí
    {
        title: "Loft industrial en Malasaña",
        address: "Calle Fuencarral 95, Madrid",
        price: 1900,
        zone: "Malasaña",
        notes: "Espectacular loft de 80m² con techos altos y grandes ventanales. Decoración moderna en pleno corazón de Malasaña. Perfecto para creativos y amantes de la cultura alternativa.",
        status: "rented",
        iconColor: "#E74C3C",
        createdBy: "Diego Martín"
    },
    {
        title: "Piso clásico en Chamberí",
        address: "Calle Sagasta 25, Madrid",
        price: 2100,
        zone: "Chamberí",
        notes: "Elegante apartamento de época totalmente rehabilitado. 3 habitaciones, suelos hidráulicos originales, balcones franceses. Zona muy tranquila y bien comunicada.",
        status: "available",
        iconColor: "#2ECC71",
        createdBy: "Lucía Santos"
    },

    // Retiro
    {
        title: "Apartamento con vistas al Retiro",
        address: "Calle Alfonso XII 30, Madrid",
        price: 2600,
        zone: "Jerónimos",
        notes: "Magnífico piso con vistas directas al Parque del Retiro. 3 habitaciones, 2 baños, cocina americana de alta gama. Ideal para disfrutar de la naturaleza en pleno centro.",
        status: "available",
        iconColor: "#27AE60",
        createdBy: "Roberto Silva"
    },
    {
        title: "Estudio en Ibiza",
        address: "Calle Ibiza 40, Madrid",
        price: 1100,
        zone: "Ibiza",
        notes: "Acogedor estudio completamente equipado en una de las zonas más trendy de Madrid. Cerca del Retiro y con excelente vida nocturna. Perfecto para jóvenes profesionales.",
        status: "available",
        iconColor: "#3498DB",
        createdBy: "Carmen Jiménez"
    },

    // Arganzuela
    {
        title: "Apartamento moderno en Delicias",
        address: "Paseo de las Delicias 120, Madrid",
        price: 1450,
        zone: "Delicias",
        notes: "Piso de nueva construcción con todas las comodidades modernas. 2 habitaciones, cocina equipada, aire acondicionado. Muy cerca de Atocha y Madrid Río.",
        status: "available",
        iconColor: "#E67E22",
        createdBy: "Alejandro Vega"
    },
    {
        title: "Loft en Madrid Río",
        address: "Calle Embajadores 180, Madrid",
        price: 1800,
        zone: "Embajadores",
        notes: "Moderno loft con terraza en el vibrante barrio de Embajadores. Zona multicultural con gran oferta gastronómica. Reformado completamente, mobiliario de diseño incluido.",
        status: "rented",
        iconColor: "#8E44AD",
        createdBy: "Patricia Herrera"
    },

    // Carabanchel
    {
        title: "Piso familiar en Carabanchel",
        address: "Calle General Ricardos 50, Madrid",
        price: 1200,
        zone: "Carabanchel",
        notes: "Amplio apartamento de 4 habitaciones ideal para familias. Edificio con ascensor, muy luminoso, con patio interior. Zona en pleno desarrollo con buenas comunicaciones.",
        status: "available",
        iconColor: "#1ABC9C",
        createdBy: "Miguel Ángel Torres"
    },

    // Usera
    {
        title: "Apartamento renovado en Usera",
        address: "Calle Orcasur 15, Madrid",
        price: 950,
        zone: "Orcasur",
        notes: "Piso completamente reformado en zona emergente de Madrid. 3 habitaciones, cocina nueva, suelos de tarima. Excelente relación calidad-precio en barrio en crecimiento.",
        status: "available",
        iconColor: "#F1C40F",
        createdBy: "Raquel Moreno"
    },

    // Puente de Vallecas
    {
        title: "Piso acogedor en Vallecas",
        address: "Avenida de la Albufera 200, Madrid",
        price: 1100,
        zone: "Puente de Vallecas",
        notes: "Cómodo apartamento de 3 habitaciones en zona familiar. Bien comunicado con el centro, cerca de parques y centros comerciales. Comunidad muy tranquila.",
        status: "available",
        iconColor: "#E91E63",
        createdBy: "Fernando Castro"
    },

    // Moratalaz
    {
        title: "Apartamento con garaje en Moratalaz",
        address: "Calle Arroyo del Olivar 45, Madrid",
        price: 1350,
        zone: "Moratalaz",
        notes: "Práctico piso de 3 habitaciones con plaza de garaje incluida. Zona residencial muy tranquila, ideal para familias. Cerca de colegios y centros de salud.",
        status: "available",
        iconColor: "#FF9800",
        createdBy: "Natalia Ramos"
    },

    // Ciudad Lineal
    {
        title: "Piso luminoso en Ventas",
        address: "Calle Alcalá 400, Madrid",
        price: 1250,
        zone: "Ventas",
        notes: "Apartamento muy luminoso con 3 habitaciones y 2 baños. Reformado recientemente, con calefacción central. Cerca de Las Ventas y con buena conexión de metro.",
        status: "rented",
        iconColor: "#795548",
        createdBy: "Sergio Delgado"
    },

    // Hortaleza
    {
        title: "Apartamento en zona verde",
        address: "Calle Arturo Soria 250, Madrid",
        price: 1600,
        zone: "Hortaleza",
        notes: "Piso exterior en zona residencial rodeada de espacios verdes. 3 habitaciones, cocina independiente, trastero. Perfecto para quienes buscan tranquilidad sin alejarse del centro.",
        status: "available",
        iconColor: "#607D8B",
        createdBy: "Mónica Guerrero"
    },

    // Villaverde
    {
        title: "Apartamento económico en Villaverde",
        address: "Avenida de los Poblados 30, Madrid",
        price: 850,
        zone: "Villaverde",
        notes: "Piso de 2 habitaciones en excelente estado y precio muy competitivo. Zona en desarrollo con nuevas infraestructuras. Ideal para primeros compradores o inversión.",
        status: "available",
        iconColor: "#4CAF50",
        createdBy: "José Luis Pérez"
    },

    // Villa de Vallecas
    {
        title: "Casa adosada en Villa de Vallecas",
        address: "Calle Sierra Gorda 20, Madrid",
        price: 1400,
        zone: "Villa de Vallecas",
        notes: "Acogedora casa de 3 plantas con pequeño jardín. 4 habitaciones, 2 baños, garaje. Ambiente de pueblo dentro de Madrid, muy familiar y tranquilo.",
        status: "available",
        iconColor: "#FF5722",
        createdBy: "Cristina Rueda"
    },

    // Vicálvaro
    {
        title: "Piso nuevo en Vicálvaro",
        address: "Avenida Real Madrid 80, Madrid",
        price: 1150,
        zone: "Vicálvaro",
        notes: "Apartamento de obra nueva con acabados de primera calidad. 3 habitaciones, 2 baños, cocina equipada. Urbanización con piscina y zona infantil. Muy bien comunicado.",
        status: "available",
        iconColor: "#9C27B0",
        createdBy: "Alberto Navarro"
    },

    // San Blas-Canillejas
    {
        title: "Apartamento en San Blas",
        address: "Avenida de Aragón 300, Madrid",
        price: 1300,
        zone: "San Blas",
        notes: "Piso de 3 habitaciones en zona comercial muy activa. Cerca del centro comercial La Gavia. Ideal para familias jóvenes que buscan comodidad y buenos precios.",
        status: "available",
        iconColor: "#673AB7",
        createdBy: "Silvia Romero"
    },

    // Barajas
    {
        title: "Chalet cerca del aeropuerto",
        address: "Calle Silvano 15, Madrid",
        price: 1500,
        zone: "Barajas",
        notes: "Casa unifamiliar perfecta para profesionales que viajan frecuentemente. 4 habitaciones, jardín, garaje para 2 coches. Zona muy tranquila y residencial.",
        status: "rented",
        iconColor: "#FF4081",
        createdBy: "David Iglesias"
    },

    // Tetuán
    {
        title: "Piso reformado en Tetuán",
        address: "Calle Bravo Murillo 180, Madrid",
        price: 1450,
        zone: "Tetuán",
        notes: "Apartamento totalmente renovado con materiales de calidad. 3 habitaciones, cocina americana, baño con ducha. Zona multicultural y muy bien comunicada.",
        status: "available",
        iconColor: "#00BCD4",
        createdBy: "Elena Vargas"
    },

    // Moncloa-Aravaca
    {
        title: "Apartamento universitario",
        address: "Calle Princesa 40, Madrid",
        price: 1800,
        zone: "Moncloa",
        notes: "Piso ideal para estudiantes o profesores universitarios. Muy cerca de Ciudad Universitaria. 2 habitaciones, estudio independiente, biblioteca incluida.",
        status: "available",
        iconColor: "#FFEB3B",
        createdBy: "Profesor García"
    },
    {
        title: "Casa en Aravaca",
        address: "Calle de la Coruña 200, Madrid",
        price: 2200,
        zone: "Aravaca",
        notes: "Hermosa casa unifamiliar en zona residencial exclusiva. 5 habitaciones, jardín privado, garaje, piscina comunitaria. Ambiente familiar y seguro.",
        status: "available",
        iconColor: "#CDDC39",
        createdBy: "Francisco Molina"
    },

    // Fuencarral-El Pardo
    {
        title: "Apartamento en Fuencarral",
        address: "Calle Valdeacederas 50, Madrid",
        price: 1350,
        zone: "Fuencarral",
        notes: "Piso de 3 habitaciones en zona en expansión. Cerca del metro y autobuses. Edificio moderno con ascensor, muy luminoso y silencioso.",
        status: "available",
        iconColor: "#8BC34A",
        createdBy: "Javier Cortés"
    }
];

export async function POST(request: NextRequest) {
    try {
        console.log('Iniciando proceso de seed...')

        // Limpiar apartamentos existentes (opcional)
        const { searchParams } = new URL(request.url)
        const clean = searchParams.get('clean') === 'true'

        if (clean) {
            await prisma.apartment.deleteMany({})
            console.log('Apartamentos existentes eliminados')
        }

        let created = 0
        let failed = 0

        for (const apt of seedApartments) {
            try {
                console.log(`Procesando: ${apt.address}`)

                // Verificar si ya existe un apartamento en esta dirección
                const existing = await prisma.apartment.findFirst({
                    where: { address: apt.address }
                })

                if (existing) {
                    console.log(`Ya existe apartamento en: ${apt.address}`)
                    continue
                }

                // Obtener coordenadas
                const coordinates = await geocodeAddress(apt.address)

                if (!coordinates) {
                    console.error(`No se pudo geocodificar: ${apt.address}`)
                    failed++
                    continue
                }

                // Crear apartamento
                await prisma.apartment.create({
                    data: {
                        title: apt.title,
                        address: apt.address,
                        price: apt.price,
                        zone: apt.zone,
                        notes: apt.notes,
                        status: apt.status as 'available' | 'rented',
                        iconColor: apt.iconColor,
                        lat: coordinates.lat,
                        lng: coordinates.lng,
                        createdBy: apt.createdBy,
                        // No asignamos userId para que sean apartamentos "públicos"
                    }
                })

                created++
                console.log(`✓ Creado: ${apt.title} en ${apt.zone}`)

                // Pequeña pausa para no sobrecargar la API de geocoding
                await new Promise(resolve => setTimeout(resolve, 1000))

            } catch (error) {
                console.error(`Error creando apartamento ${apt.address}:`, error)
                failed++
            }
        }

        return NextResponse.json({
            message: 'Proceso de seed completado',
            created,
            failed,
            total: seedApartments.length
        })

    } catch (error) {
        console.error('Error en seed:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Endpoint para poblar la base de datos con apartamentos de ejemplo',
        usage: {
            'POST /api/seed-apartments': 'Crear apartamentos de ejemplo',
            'POST /api/seed-apartments?clean=true': 'Limpiar base de datos y crear apartamentos nuevos'
        },
        apartmentsCount: seedApartments.length
    })
}
