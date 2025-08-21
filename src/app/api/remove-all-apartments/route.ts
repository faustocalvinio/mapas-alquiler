import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        // Contar apartamentos antes de borrar
        const apartmentCount = await prisma.apartment.count()

        if (apartmentCount === 0) {
            return NextResponse.json(
                {
                    message: 'No hay apartamentos para borrar',
                    deletedCount: 0
                }
            )
        }

        // Borrar todos los apartamentos
        const deleteResult = await prisma.apartment.deleteMany({})

        return NextResponse.json(
            {
                message: `Se borraron ${deleteResult.count} apartamentos correctamente`,
                deletedCount: deleteResult.count
            }
        )
    } catch (error) {
        console.error('Error borrando todos los apartamentos:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
