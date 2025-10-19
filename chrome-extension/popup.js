// popup.js - Lógica del popup de la extensión

let extractedData = null;

// Cargar configuración al abrir el popup
document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    setupEventListeners();
    checkIfIdealistaPage();
});

// Configurar event listeners
function setupEventListeners() {
    // Tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });

    // Botones
    document.getElementById('extract-btn').addEventListener('click', extractData);
    document.getElementById('save-btn').addEventListener('click', saveApartment);
    document.getElementById('save-config').addEventListener('click', saveConfig);
    document.getElementById('test-connection').addEventListener('click', testConnection);
}

// Cambiar entre tabs
function switchTab(tabName) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Cargar configuración guardada
async function loadConfig() {
    try {
        const result = await chrome.storage.sync.get(['apiUrl', 'apiKey']);

        if (result.apiUrl) {
            document.getElementById('api-url').value = result.apiUrl;
        } else {
            // Sugerir URL de producción por defecto
            document.getElementById('api-url').value = 'https://mapa.facal.space';
        }

        if (result.apiKey) {
            document.getElementById('api-key').value = result.apiKey;
        }
    } catch (error) {
        console.error('Error cargando configuración:', error);
    }
}

// Guardar configuración
async function saveConfig() {
    const apiUrl = document.getElementById('api-url').value.trim();
    const apiKey = document.getElementById('api-key').value.trim();

    if (!apiUrl || !apiKey) {
        showStatus('error', 'Por favor completa todos los campos');
        return;
    }

    // Validar formato de URL
    try {
        new URL(apiUrl);
    } catch (e) {
        showStatus('error', 'URL inválida. Usa formato: http://localhost:3000');
        return;
    }

    try {
        await chrome.storage.sync.set({ apiUrl, apiKey });
        showStatus('success', '✅ Configuración guardada correctamente');
    } catch (error) {
        showStatus('error', '❌ Error guardando configuración: ' + error.message);
    }
}

// Probar conexión con la API
async function testConnection() {
    const apiUrl = document.getElementById('api-url').value.trim();
    const apiKey = document.getElementById('api-key').value.trim();

    if (!apiUrl || !apiKey) {
        showStatus('error', 'Por favor configura la URL y API Key primero');
        return;
    }

    showStatus('info', '🔄 Probando conexión...');

    try {
        const response = await fetch(`${apiUrl}/api/apartments/from-extension`, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.valid) {
            showStatus('success', `✅ Conexión exitosa! Usuario: ${data.user.name || data.user.email}`);
        } else {
            showStatus('error', '❌ API Key inválida o usuario no autorizado');
        }
    } catch (error) {
        showStatus('error', '❌ Error de conexión: ' + error.message);
    }
}

// Verificar si estamos en una página de Idealista
async function checkIfIdealistaPage() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab.url.includes('idealista.com')) {
            showStatus('warning', '⚠️ Abre una página de anuncio de Idealista para extraer datos');
            document.getElementById('extract-btn').disabled = true;
        } else {
            document.getElementById('extract-btn').disabled = false;
        }
    } catch (error) {
        console.error('Error verificando página:', error);
    }
}

// Extraer datos de la página
async function extractData() {
    showStatus('info', '🔄 Extrayendo datos...');

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab.url.includes('idealista.com')) {
            showStatus('error', '❌ Esta extensión solo funciona en páginas de Idealista');
            return;
        }

        // Enviar mensaje al content script
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractData' });

        if (response.success) {
            extractedData = response.data;
            displayPreview(extractedData);
            showStatus('success', '✅ Datos extraídos correctamente');

            // Mostrar botón de guardar
            document.getElementById('save-btn').classList.remove('hidden');
            document.getElementById('save-btn').disabled = false;
        } else {
            showStatus('error', '❌ Error: ' + response.error);
        }
    } catch (error) {
        console.error('Error extrayendo datos:', error);
        showStatus('error', '❌ Error: ' + error.message + '. Recarga la página de Idealista.');
    }
}

// Mostrar preview de los datos extraídos
function displayPreview(data) {
    const previewContent = document.getElementById('preview-content');
    const preview = document.getElementById('apartment-preview');

    let html = '';

    if (data.title) {
        html += `<div class="preview-item"><span class="preview-label">Título:</span> <span class="preview-value">${data.title}</span></div>`;
    }

    if (data.address) {
        html += `<div class="preview-item"><span class="preview-label">Dirección:</span> <span class="preview-value">${data.address}</span></div>`;
    }

    if (data.price) {
        html += `<div class="preview-item"><span class="preview-label">Precio:</span> <span class="preview-value">${data.price}€/mes</span></div>`;
    }

    if (data.zone) {
        html += `<div class="preview-item"><span class="preview-label">Zona:</span> <span class="preview-value">${data.zone}</span></div>`;
    }

    if (data.link) {
        html += `<div class="preview-item"><span class="preview-label">Link:</span> <span class="preview-value">${data.link.substring(0, 50)}...</span></div>`;
    }

    previewContent.innerHTML = html;
    preview.classList.add('show');
}

// Guardar apartamento en la API
async function saveApartment() {
    if (!extractedData) {
        showStatus('error', '❌ No hay datos para guardar');
        return;
    }

    // Obtener configuración
    const result = await chrome.storage.sync.get(['apiUrl', 'apiKey']);

    if (!result.apiUrl || !result.apiKey) {
        showStatus('error', '❌ Configura la API primero');
        switchTab('config');
        return;
    }

    const saveBtn = document.getElementById('save-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner"></span>Guardando...';
    showStatus('info', '🔄 Guardando apartamento...');

    try {
        const response = await fetch(`${result.apiUrl}/api/apartments/from-extension`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': result.apiKey
            },
            body: JSON.stringify(extractedData)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showStatus('success', '✅ Apartamento guardado exitosamente!');
            saveBtn.innerHTML = '✅ Guardado';

            // Reset después de 2 segundos
            setTimeout(() => {
                saveBtn.classList.add('hidden');
                document.getElementById('apartment-preview').classList.remove('show');
                extractedData = null;
            }, 2000);
        } else {
            throw new Error(data.error || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error guardando:', error);
        showStatus('error', '❌ Error: ' + error.message);
        saveBtn.disabled = false;
        saveBtn.innerHTML = '💾 Guardar apartamento';
    }
}

// Mostrar mensajes de estado
function showStatus(type, message) {
    const statusDiv = document.getElementById('status');
    statusDiv.className = `status ${type}`;
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';

    // Auto-ocultar después de 5 segundos (excepto errores)
    if (type !== 'error') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}
