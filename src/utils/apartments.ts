// Constante de conversión
export const USD_TO_ARS_RATE = 1500;

// Tipos para los apartamentos
export interface Apartment {
    id: string;
    title?: string;
    address: string;
    priceUSD: number;
    priceARS?: number;
    currency: string;
    zone?: string;
    neighborhood?: string;
    rooms?: number;
    bathrooms?: number;
    squareMeters?: number;
    expenses?: number;
    notes?: string;
    link?: string;
    lat: number;
    lng: number;
    status: string;
    iconColor: string;
    createdBy?: string;
    userId?: string;
    user?: {
        name?: string;
        email?: string;
    };
    createdAt: string;
    updatedAt: string;
}

// Función para convertir ARS a USD
export function arsToUsd(ars: number): number {
    return ars / USD_TO_ARS_RATE;
}

// Función para convertir USD a ARS
export function usdToArs(usd: number): number {
    return usd * USD_TO_ARS_RATE;
}

// Función para formatear precio en USD
export function formatUSD(amount: number): string {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

// Función para formatear precio en ARS
export function formatARS(amount: number): string {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

// Función para normalizar el apartamento (asegurar que tenga ambos precios)
export function normalizeApartment(apartment: any): Apartment {
    if (apartment.currency === 'ARS' && apartment.priceARS && !apartment.priceUSD) {
        apartment.priceUSD = arsToUsd(apartment.priceARS);
    } else if (apartment.currency === 'USD' && apartment.priceUSD && !apartment.priceARS) {
        apartment.priceARS = usdToArs(apartment.priceUSD);
    }

    return apartment as Apartment;
}

// Barrios de CABA
export const CABA_NEIGHBORHOODS = [
    'Palermo',
    'Recoleta',
    'Belgrano',
    'Caballito',
    'Villa Crespo',
    'Almagro',
    'Balvanera',
    'San Telmo',
    'Monserrat',
    'Puerto Madero',
    'Núñez',
    'Colegiales',
    'Villa Urquiza',
    'Villa Devoto',
    'Villa del Parque',
    'Flores',
    'Parque Patricios',
    'Barracas',
    'La Boca',
    'Constitución',
    'San Nicolás',
    'Retiro',
    'Agronomía',
    'Chacarita',
    'Parque Chacabuco',
    'Boedo',
    'Villa Lugano',
    'Villa Soldati',
    'Villa Riachuelo',
    'Mataderos',
    'Liniers',
    'Versalles',
    'Monte Castro',
    'Floresta',
    'Vélez Sársfield',
    'Villa Luro',
    'Villa Real',
    'Villa General Mitre',
    'Paternal',
    'Villa Pueyrredón',
    'Saavedra',
    'Coghlan',
    'Villa Ortúzar',
    'Parque Chas',
    'San Cristóbal',
    'Parque Centenario',
];
