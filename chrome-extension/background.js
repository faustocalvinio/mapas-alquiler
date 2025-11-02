// Background service worker para la extensión

// Listener para mensajes desde el content script o popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveApartment') {
        saveApartmentToAPI(request.data)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Mantiene el canal abierto para respuesta asíncrona
    }
});

// Función para guardar apartamento en el API
async function saveApartmentToAPI(apartmentData) {
    try {
        // Obtener configuración
        const config = await chrome.storage.sync.get(['apiKey', 'apiUrl', 'usdRate']);

        if (!config.apiKey || !config.apiUrl) {
            throw new Error('API Key o URL no configurados');
        }

        const response = await fetch(`${config.apiUrl}/api/apartments/extension`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': config.apiKey
            },
            body: JSON.stringify({
                ...apartmentData,
                usdRate: config.usdRate || 1500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving apartment:', error);
        throw error;
    }
}

// Listener para cuando se instala la extensión
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Extensión instalada');

        // Configuración por defecto
        chrome.storage.sync.set({
            apiUrl: 'http://localhost:3000',
            usdRate: 1500
        });
    }
});

// Listener para acciones del ícono de la extensión
chrome.action.onClicked.addListener((tab) => {
    // Abrir popup (esto es manejado automáticamente por manifest.json)
});
