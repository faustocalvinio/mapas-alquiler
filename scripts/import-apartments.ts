import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

interface ApartmentCSVRow {
    id: string;
    title: string;
    address: string;
    price: string;
    zone: string;
    lat: string;
    lng: string;
    createdAt: string;
    notes: string;
    createdBy: string;
    userId: string;
    iconColor: string;
    status: string;
    link: string;
}

async function importApartments() {
    try {
        // Ruta al archivo CSV
        const csvFilePath = path.join(process.cwd(), 'data', 'Apartment.csv');

        // Leer el archivo CSV
        const csvContent = fs.readFileSync(csvFilePath, 'utf-8');

        // Parsear el CSV
        const records: ApartmentCSVRow[] = parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
        });

        console.log(`Encontrados ${records.length} apartamentos en el CSV`);

        // Procesar cada apartamento
        for (const record of records) {
            try {
                // Verificar si el apartamento ya existe
                const existingApartment = await prisma.apartment.findUnique({
                    where: { id: record.id }
                });

                if (existingApartment) {
                    console.log(`Apartamento ${record.id} ya existe, actualizando...`);

                    // Actualizar apartamento existente
                    await prisma.apartment.update({
                        where: { id: record.id },
                        data: {
                            title: record.title || null,
                            address: record.address,
                            priceUSD: parseFloat(record.price) || 0,
                            zone: record.zone || null,
                            lat: parseFloat(record.lat),
                            lng: parseFloat(record.lng),
                            notes: record.notes || null,
                            createdBy: record.createdBy || null,
                            userId: record.userId || null,
                            iconColor: record.iconColor || '#3B82F6',
                            status: record.status || 'available',
                            link: record.link || null,
                            createdAt: record.createdAt ? new Date(record.createdAt) : new Date(),
                        }
                    });

                    console.log(`✓ Apartamento ${record.title} actualizado`);
                } else {
                    // Crear nuevo apartamento
                    await prisma.apartment.create({
                        data: {
                            id: record.id,
                            title: record.title || null,
                            address: record.address,
                            priceUSD: parseFloat(record.price) || 0,
                            zone: record.zone || null,
                            lat: parseFloat(record.lat),
                            lng: parseFloat(record.lng),
                            notes: record.notes || null,
                            createdBy: record.createdBy || null,
                            userId: record.userId || null,
                            iconColor: record.iconColor || '#3B82F6',
                            status: record.status || 'available',
                            link: record.link || null,
                            createdAt: record.createdAt ? new Date(record.createdAt) : new Date(),
                        }
                    });

                    console.log(`✓ Apartamento ${record.title} creado`);
                }
            } catch (error) {
                console.error(`Error procesando apartamento ${record.title}:`, error);
            }
        }

        console.log('Importación completada');
    } catch (error) {
        console.error('Error durante la importación:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar la función si el script se ejecuta directamente
const __filename = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] === __filename;

if (isMainModule) {
    importApartments();
}

export { importApartments };