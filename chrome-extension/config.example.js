// Configuración de ejemplo para la extensión
// Copia este archivo para crear configuraciones personalizadas

const CONFIG = {
    // URLs
    API_URL_DEV: 'http://localhost:3000',
    API_URL_PROD: 'https://tu-dominio.com',

    // Conversión de moneda
    USD_TO_ARS_DEFAULT: 1500,

    // Colores
    DEFAULT_ICON_COLOR: '#10b981', // Verde para propiedades de ZonaProp

    // Selectores de ZonaProp
    // IMPORTANTE: Estos pueden cambiar si ZonaProp actualiza su sitio
    SELECTORS: {
        // Página de listado
        propertyCards: '[data-qa="posting PROPERTY"]',
        price: '[data-qa="POSTING_CARD_PRICE"]',
        expenses: '[data-qa="expensas"]',
        location: '[data-qa="POSTING_CARD_LOCATION"]',
        features: '[data-qa="POSTING_CARD_FEATURES"]',
        link: 'a[data-qa="posting-link"]',
        title: '[data-qa="POSTING_CARD_DESCRIPTION"]',

        // Alternativos (si los principales no funcionan)
        priceAlt: '.price-items, .price',
        expensesAlt: '.expensas',
        locationAlt: '.location-property, .location',
        linkAlt: 'a.card-link',
        titleAlt: '.card-title, .title-property',
        featuresAlt: '.property-features span, .features span'
    },

    // Timeouts
    SYNC_DELAY_MS: 500, // Delay entre requests para evitar rate limiting

    // Debugging
    DEBUG_MODE: false, // Cambia a true para ver logs detallados

    // Validaciones
    MIN_PRICE: 100, // USD mínimo aceptable
    MAX_PRICE: 100000, // USD máximo aceptable

    // Mensajes
    MESSAGES: {
        es: {
            saving: 'Guardando...',
            saved: 'Guardado',
            error: 'Error',
            syncing: 'Sincronizando...',
            success: 'Éxito'
        },
        en: {
            saving: 'Saving...',
            saved: 'Saved',
            error: 'Error',
            syncing: 'Syncing...',
            success: 'Success'
        }
    }
};

// Función helper para logging en modo debug
function debugLog(...args) {
    if (CONFIG.DEBUG_MODE) {
        console.log('[ZonaProp Extension]', ...args);
    }
}

// Exportar config
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
