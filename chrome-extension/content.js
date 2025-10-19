// content.js - Extrae datos de la página de Idealista

function extractApartmentData() {
    console.log('🔍 Extrayendo datos de Idealista...');

    const data = {
        title: null,
        address: null,
        price: null,
        zone: null,
        notes: null,
        link: window.location.href
    };

    try {
        // Extraer título
        const titleElement = document.querySelector('h1.main-info__title-main') ||
            document.querySelector('.main-info__title-main') ||
            document.querySelector('h1[itemprop="name"]');
        if (titleElement) {
            data.title = titleElement.textContent.trim();
        }

        // Extraer precio
        const priceElement = document.querySelector('.info-data-price') ||
            document.querySelector('span.info-data-price') ||
            document.querySelector('[class*="price"]');
        if (priceElement) {
            const priceText = priceElement.textContent.trim();
            // Extraer solo números
            const priceMatch = priceText.match(/[\d.]+/);
            if (priceMatch) {
                data.price = parseInt(priceMatch[0].replace('.', ''));
            }
        }

        // Extraer dirección
        const addressElement = document.querySelector('.main-info__title-minor') ||
            document.querySelector('[class*="address"]') ||
            document.querySelector('span[itemprop="address"]');
        if (addressElement) {
            data.address = addressElement.textContent.trim();
        }

        // Extraer zona/barrio (generalmente está en la dirección)
        if (data.address) {
            // Intentar extraer el barrio de la dirección
            const addressParts = data.address.split(',');
            if (addressParts.length > 1) {
                data.zone = addressParts[addressParts.length - 2].trim();
            }
        }

        // Extraer descripción para las notas
        const descriptionElement = document.querySelector('.comment') ||
            document.querySelector('[class*="description"]') ||
            document.querySelector('.adCommentsLanguage');
        if (descriptionElement) {
            const description = descriptionElement.textContent.trim();
            // Limitar la descripción a 500 caracteres
            data.notes = description.length > 500
                ? description.substring(0, 500) + '...'
                : description;
        }

        // Extraer características adicionales
        const features = [];
        const featureElements = document.querySelectorAll('.details-property_features li');
        featureElements.forEach(el => {
            features.push(el.textContent.trim());
        });

        if (features.length > 0 && !data.notes) {
            data.notes = 'Características: ' + features.join(', ');
        } else if (features.length > 0) {
            data.notes += '\n\nCaracterísticas: ' + features.join(', ');
        }

        console.log('✅ Datos extraídos:', data);
        return { success: true, data };

    } catch (error) {
        console.error('❌ Error extrayendo datos:', error);
        return { success: false, error: error.message };
    }
}

// Escuchar mensajes del popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractData') {
        const result = extractApartmentData();
        sendResponse(result);
    }
    return true; // Mantener el canal abierto para respuesta asíncrona
});

console.log('🎯 Content script de Idealista cargado');
