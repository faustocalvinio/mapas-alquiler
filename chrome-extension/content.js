// Content script que se ejecuta en las páginas de ZonaProp

// Función para extraer información de la página actual
function extractPropertyInfo() {
    // Verifica si estamos en una página de detalle de propiedad
    const isDetailPage = window.location.pathname.includes('-');

    if (isDetailPage) {
        return extractFromDetailPage();
    } else {
        return extractFromListingPage();
    }
}

// Extraer información desde una página de detalle
function extractFromDetailPage() {
    try {
        const propertyData = {};

        // Título
        const titleElement = document.querySelector('h1[data-qa="POSTING_CARD_TITLE"], h1.title-property');
        propertyData.title = titleElement ? titleElement.textContent.trim() : '';

        // Precio
        const priceElement = document.querySelector('[data-qa="POSTING_CARD_PRICE"], .price-items');
        if (priceElement) {
            const priceText = priceElement.textContent.trim();
            if (priceText.includes('USD')) {
                propertyData.currency = 'USD';
                propertyData.priceARS = parseFloat(priceText.replace(/[^\d.]/g, ''));
            } else {
                propertyData.currency = 'ARS';
                propertyData.priceARS = parseFloat(priceText.replace(/[^\d.]/g, ''));
            }
        }

        // Expensas
        const expensesElement = document.querySelector('[data-qa="expensas"], .expensas');
        if (expensesElement) {
            const expensesText = expensesElement.textContent.trim();
            propertyData.expenses = parseFloat(expensesText.replace(/[^\d.]/g, '')) || 0;
        }

        // Dirección
        const addressElement = document.querySelector('[data-qa="POSTING_CARD_LOCATION"], .location-property');
        propertyData.address = addressElement ? addressElement.textContent.trim() : '';

        // Características
        const features = document.querySelectorAll('[data-qa="POSTING_CARD_FEATURES"] span, .property-features span');
        features.forEach(feature => {
            const text = feature.textContent.trim().toLowerCase();
            if (text.includes('amb')) {
                propertyData.rooms = parseInt(text);
            } else if (text.includes('m²') || text.includes('m2')) {
                propertyData.squareMeters = parseFloat(text.replace(/[^\d.]/g, ''));
            } else if (text.includes('baño')) {
                propertyData.bathrooms = parseInt(text);
            }
        });

        // Link actual
        propertyData.link = window.location.href;

        return propertyData;
    } catch (error) {
        console.error('Error extracting property info:', error);
        return null;
    }
}

// Extraer información desde una página de listado
function extractFromListingPage() {
    const properties = [];
    const propertyCards = document.querySelectorAll('[data-qa="posting PROPERTY"], .card-container');

    propertyCards.forEach(card => {
        try {
            const propertyData = {};

            // Precio
            const priceElement = card.querySelector('[data-qa="POSTING_CARD_PRICE"], .price');
            if (priceElement) {
                const priceText = priceElement.textContent.trim();
                if (priceText.includes('USD')) {
                    propertyData.currency = 'USD';
                    propertyData.priceARS = parseFloat(priceText.replace(/[^\d.]/g, ''));
                } else {
                    propertyData.currency = 'ARS';
                    propertyData.priceARS = parseFloat(priceText.replace(/[^\d.]/g, ''));
                }
            }

            // Expensas
            const expensesElement = card.querySelector('[data-qa="expensas"], .expensas');
            if (expensesElement) {
                const expensesText = expensesElement.textContent.trim();
                propertyData.expenses = parseFloat(expensesText.replace(/[^\d.]/g, '')) || 0;
            }

            // Dirección
            const addressElement = card.querySelector('[data-qa="POSTING_CARD_LOCATION"], .location');
            propertyData.address = addressElement ? addressElement.textContent.trim() : '';

            // Link
            const linkElement = card.querySelector('a[data-qa="posting-link"], a.card-link');
            propertyData.link = linkElement ? linkElement.href : '';

            // Título
            const titleElement = card.querySelector('[data-qa="POSTING_CARD_DESCRIPTION"], .card-title');
            propertyData.title = titleElement ? titleElement.textContent.trim() : '';

            // Características
            const features = card.querySelectorAll('[data-qa="POSTING_CARD_FEATURES"] span, .features span');
            features.forEach(feature => {
                const text = feature.textContent.trim().toLowerCase();
                if (text.includes('amb')) {
                    propertyData.rooms = parseInt(text);
                } else if (text.includes('m²') || text.includes('m2')) {
                    propertyData.squareMeters = parseFloat(text.replace(/[^\d.]/g, ''));
                } else if (text.includes('baño')) {
                    propertyData.bathrooms = parseInt(text);
                }
            });

            if (propertyData.address && propertyData.priceARS) {
                properties.push(propertyData);
            }
        } catch (error) {
            console.error('Error extracting property from card:', error);
        }
    });

    return properties.length > 0 ? properties : null;
}

// Escuchar mensajes desde el popup o background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractProperties') {
        const data = extractPropertyInfo();
        sendResponse({ success: true, data });
    }
    return true;
});

// Agregar botón flotante para guardar rápidamente (opcional)
function addQuickSaveButton() {
    // Solo en páginas de detalle
    if (!window.location.pathname.includes('-')) return;

    const button = document.createElement('button');
    button.textContent = '💾 Guardar en Mapas';
    button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    padding: 12px 20px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
  `;

    button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#2563eb';
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#3b82f6';
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });

    button.addEventListener('click', async () => {
        button.textContent = '⏳ Guardando...';
        button.disabled = true;

        const propertyData = extractPropertyInfo();

        if (!propertyData) {
            button.textContent = '❌ Error';
            setTimeout(() => {
                button.textContent = '💾 Guardar en Mapas';
                button.disabled = false;
            }, 2000);
            return;
        }

        try {
            const response = await chrome.runtime.sendMessage({
                action: 'saveApartment',
                data: propertyData
            });

            if (response.success) {
                button.textContent = '✅ Guardado';
                setTimeout(() => {
                    button.textContent = '💾 Guardar en Mapas';
                    button.disabled = false;
                }, 2000);
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            console.error('Error:', error);
            button.textContent = '❌ Error';
            setTimeout(() => {
                button.textContent = '💾 Guardar en Mapas';
                button.disabled = false;
            }, 2000);
        }
    });

    document.body.appendChild(button);
}

// Agregar el botón cuando la página cargue
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addQuickSaveButton);
} else {
    addQuickSaveButton();
}
