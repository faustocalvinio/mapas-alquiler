import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface ApartmentCSVRow {
    id?: string;
    title: string;
    address: string;
    price: string;
    zone?: string;
    lat: string;
    lng: string;
    createdAt?: string;
    notes?: string;
    createdBy?: string;
    userId?: string;
    iconColor?: string;
    status?: string;
    link?: string;
}

export async function POST(request: NextRequest) {
    try {
        // Verificar autenticación
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No se encontró archivo' }, { status: 400 });
        }

        if (!file.name.endsWith('.csv')) {
            return NextResponse.json({ error: 'El archivo debe ser un CSV' }, { status: 400 });
        }

        // Leer el contenido del archivo
        const csvContent = await file.text();

        // Parsear el CSV
        const records: ApartmentCSVRow[] = parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
        });

        const results = {
            created: 0,
            updated: 0,
            errors: [] as string[],
            total: records.length
        };

        // Procesar cada apartamento
        for (const [index, record] of records.entries()) {
            try {
                // Validar datos requeridos
                if (!record.address || !record.lat || !record.lng || !record.price) {
                    results.errors.push(`Fila ${index + 2}: Faltan campos requeridos (address, lat, lng, price)`);
                    continue;
                }

                const apartmentData = {
                    title: record.title || null,
                    address: record.address,
                    price: parseInt(record.price) || 0,
                    zone: record.zone || null,
                    lat: parseFloat(record.lat),
                    lng: parseFloat(record.lng),
                    notes: record.notes || null,
                    createdBy: record.createdBy || session.user.name || null,
                    userId: record.userId || session.user.id || null,
                    iconColor: record.iconColor || '#3B82F6',
                    status: record.status || 'available',
                    link: record.link || null,
                    createdAt: record.createdAt ? new Date(record.createdAt) : new Date(),
                };

                if (record.id) {
                    // Si tiene ID, verificar si existe para actualizar o crear con ID específico
                    const existingApartment = await prisma.apartment.findUnique({
                        where: { id: record.id }
                    });

                    if (existingApartment) {
                        await prisma.apartment.update({
                            where: { id: record.id },
                            data: apartmentData
                        });
                        results.updated++;
                    } else {
                        await prisma.apartment.create({
                            data: {
                                id: record.id,
                                ...apartmentData
                            }
                        });
                        results.created++;
                    }
                } else {
                    // Crear nuevo apartamento sin ID específico
                    await prisma.apartment.create({
                        data: apartmentData
                    });
                    results.created++;
                }

            } catch (error) {
                console.error(`Error procesando fila ${index + 2}:`, error);
                results.errors.push(`Fila ${index + 2}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            }
        }

        return NextResponse.json({
            message: 'Importación completada',
            results
        });

    } catch (error) {
        console.error('Error durante la importación:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}