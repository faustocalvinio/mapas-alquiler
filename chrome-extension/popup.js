// Elementos del DOM
const apiKeyInput = document.getElementById('apiKey');
const apiUrlInput = document.getElementById('apiUrl');
const usdRateInput = document.getElementById('usdRate');
const saveBtn = document.getElementById('saveBtn');
const testBtn = document.getElementById('testBtn');
const syncBtn = document.getElementById('syncBtn');
const statusDiv = document.getElementById('status');

// Cargar configuración guardada
chrome.storage.sync.get(['apiKey', 'apiUrl', 'usdRate'], (result) => {
    if (result.apiKey) {
        apiKeyInput.value = result.apiKey;
    }
    if (result.apiUrl) {
        apiUrlInput.value = result.apiUrl;
    }
    if (result.usdRate) {
        usdRateInput.value = result.usdRate;
    }
});

// Función para mostrar mensajes de estado
function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';

    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
}

// Guardar configuración
saveBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    const apiUrl = apiUrlInput.value.trim();
    const usdRate = parseFloat(usdRateInput.value);

    if (!apiKey) {
        showStatus('Por favor ingresa una API Key', 'error');
        return;
    }

    if (!apiUrl) {
        showStatus('Por favor ingresa la URL del API', 'error');
        return;
    }

    if (!usdRate || usdRate <= 0) {
        showStatus('Por favor ingresa una tasa de cambio válida', 'error');
        return;
    }

    chrome.storage.sync.set({
        apiKey,
        apiUrl,
        usdRate
    }, () => {
        showStatus('✓ Configuración guardada correctamente', 'success');
    });
});

// Probar conexión
testBtn.addEventListener('click', async () => {
    const apiUrl = apiUrlInput.value.trim();

    if (!apiUrl) {
        showStatus('Por favor ingresa la URL del API', 'error');
        return;
    }

    try {
        showStatus('Probando conexión...', 'info');
        const response = await fetch(`${apiUrl}/api/apartments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            showStatus('✓ Conexión exitosa con el API', 'success');
        } else {
            showStatus(`Error: ${response.status} - ${response.statusText}`, 'error');
        }
    } catch (error) {
        showStatus(`Error de conexión: ${error.message}`, 'error');
    }
});

// Sincronizar favoritos
syncBtn.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    const apiUrl = apiUrlInput.value.trim();
    const usdRate = parseFloat(usdRateInput.value);

    if (!apiKey) {
        showStatus('Por favor configura tu API Key primero', 'error');
        return;
    }

    try {
        // Obtener la pestaña activa
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab.url.includes('zonaprop.com.ar')) {
            showStatus('Por favor abre la página de ZonaProp primero', 'error');
            return;
        }

        showStatus('Iniciando sincronización...', 'info');
        syncBtn.disabled = true;

        // Inyectar y ejecutar el script de contenido
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: extractFavorites
        });

        if (results && results[0] && results[0].result) {
            const apartments = results[0].result;

            if (apartments.length === 0) {
                showStatus('No se encontraron favoritos en esta página', 'info');
                syncBtn.disabled = false;
                return;
            }

            // Enviar cada apartamento al API
            let successCount = 0;
            let errorCount = 0;

            for (const apt of apartments) {
                try {
                    const response = await fetch(`${apiUrl}/api/apartments/extension`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-API-Key': apiKey
                        },
                        body: JSON.stringify({
                            ...apt,
                            usdRate: usdRate
                        })
                    });

                    if (response.ok) {
                        successCount++;
                    } else {
                        errorCount++;
                        console.error('Error saving apartment:', await response.text());
                    }
                } catch (error) {
                    errorCount++;
                    console.error('Error:', error);
                }
            }

            showStatus(
                `✓ Sincronización completa: ${successCount} guardados, ${errorCount} errores`,
                errorCount === 0 ? 'success' : 'info'
            );
        } else {
            showStatus('No se pudieron extraer los favoritos', 'error');
        }

        syncBtn.disabled = false;
    } catch (error) {
        console.error('Error:', error);
        showStatus(`Error: ${error.message}`, 'error');
        syncBtn.disabled = false;
    }
});

// Función que se inyecta en la página de ZonaProp para extraer favoritos
function extractFavorites() {
    const apartments = [];

    // Buscar todos los elementos de propiedad en la página
    // Este selector puede necesitar ajustes según la estructura actual de ZonaProp
    const propertyCards = document.querySelectorAll('[data-qa="posting PROPERTY"]');

    propertyCards.forEach(card => {
        try {
            // Extraer precio
            const priceElement = card.querySelector('[data-qa="POSTING_CARD_PRICE"]');
            let priceText = priceElement ? priceElement.textContent.trim() : '';

            // Extraer expensas
            const expensesElement = card.querySelector('[data-qa="expensas"]');
            let expensesText = expensesElement ? expensesElement.textContent.trim() : '';

            // Extraer dirección
            const addressElement = card.querySelector('[data-qa="POSTING_CARD_LOCATION"]');
            const address = addressElement ? addressElement.textContent.trim() : '';

            // Extraer link
            const linkElement = card.querySelector('a[data-qa="posting-link"]');
            const link = linkElement ? linkElement.href : '';

            // Extraer título
            const titleElement = card.querySelector('[data-qa="POSTING_CARD_DESCRIPTION"]');
            const title = titleElement ? titleElement.textContent.trim() : '';

            // Extraer características (ambientes, m2, etc.)
            const characteristicsElements = card.querySelectorAll('[data-qa="POSTING_CARD_FEATURES"] span');
            let rooms = null;
            let squareMeters = null;
            let bathrooms = null;

            characteristicsElements.forEach(el => {
                const text = el.textContent.trim();
                if (text.includes('amb')) {
                    rooms = parseInt(text);
                } else if (text.includes('m²')) {
                    squareMeters = parseFloat(text.replace(/[^\d.]/g, ''));
                } else if (text.includes('baño')) {
                    bathrooms = parseInt(text);
                }
            });

            // Parsear precio y moneda
            let priceARS = 0;
            let currency = 'ARS';

            if (priceText.includes('USD')) {
                currency = 'USD';
                priceARS = parseFloat(priceText.replace(/[^\d.]/g, ''));
            } else {
                priceARS = parseFloat(priceText.replace(/[^\d.]/g, ''));
            }

            // Parsear expensas
            let expenses = 0;
            if (expensesText) {
                expenses = parseFloat(expensesText.replace(/[^\d.]/g, ''));
            }

            if (address && (priceARS > 0 || currency === 'USD')) {
                apartments.push({
                    title,
                    address,
                    priceARS,
                    currency,
                    expenses,
                    link,
                    rooms,
                    bathrooms,
                    squareMeters
                });
            }
        } catch (error) {
            console.error('Error extracting apartment:', error);
        }
    });

    return apartments;
}
