# 🏠 Idealista to Mapas Alquiler - Chrome Extension

Extensión de Chrome para agregar apartamentos de Idealista a tu aplicación Mapas Alquiler con un solo click.

## 🚀 Características

- ✅ Extrae automáticamente información de anuncios de Idealista
- ✅ Captura título, dirección, precio, zona y descripción
- ✅ Envía datos directamente a tu aplicación
- ✅ Vista previa de datos antes de guardar
- ✅ Configuración simple con API Key
- ✅ Autenticación segura

## 📋 Requisitos previos

1. Tener la aplicación **Mapas Alquiler** corriendo (localhost o producción)
2. Una cuenta de usuario autorizada en la aplicación
3. Google Chrome o navegador basado en Chromium

## 🔧 Instalación

### 1. Preparar los íconos

La extensión necesita tres íconos. Puedes crearlos con cualquier herramienta de diseño o usar placeholders:

- `icons/icon16.png` (16x16px)
- `icons/icon48.png` (48x48px)
- `icons/icon128.png` (128x128px)

**Opción rápida:** Usa [este generador online](https://www.favicon-generator.org/) para crear los íconos a partir de una imagen.

### 2. Instalar la extensión en Chrome

1. Abre Chrome y ve a `chrome://extensions/`
2. Activa el **Modo de desarrollador** (esquina superior derecha)
3. Haz click en **Cargar extensión sin empaquetar**
4. Selecciona la carpeta `chrome-extension` de este proyecto
5. ¡Listo! Verás el ícono de la extensión en tu barra de herramientas

## ⚙️ Configuración

### 1. Obtener tu API Key

Tu API Key es tu email codificado en base64. Puedes obtenerla de dos formas:

**Opción A - En línea de comandos:**
```bash
# En PowerShell (Windows)
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("tu-email@example.com"))

# En terminal Unix/Mac
echo -n "tu-email@example.com" | base64
```

**Opción B - En el navegador:**
```javascript
// Abre la consola del navegador (F12) y ejecuta:
btoa("tu-email@example.com")
```

### 2. Configurar la extensión

1. Haz click en el ícono de la extensión
2. Ve a la pestaña **Configuración**
3. Ingresa la **URL de tu API**:
   - Desarrollo: `http://localhost:3000`
   - Producción: `https://tu-app.vercel.app`
4. Ingresa tu **API Key** (el email en base64)
5. Haz click en **Guardar configuración**
6. Haz click en **Probar conexión** para verificar

## 📖 Uso

### Agregar un apartamento desde Idealista

1. Navega a cualquier anuncio de Idealista (ej: `https://www.idealista.com/inmueble/...`)
2. Haz click en el ícono de la extensión
3. En la pestaña **Extraer**, haz click en **📥 Extraer datos de esta página**
4. Revisa la vista previa de los datos extraídos
5. Haz click en **💾 Guardar apartamento**
6. ¡Listo! El apartamento se agregará a tu aplicación

## 🔍 Datos que extrae

La extensión captura automáticamente:

- **Título**: Nombre del inmueble
- **Dirección**: Dirección completa
- **Precio**: Precio mensual de alquiler
- **Zona/Barrio**: Zona o barrio (extraído de la dirección)
- **Descripción**: Descripción del inmueble (guardada en "notas")
- **Características**: Metros cuadrados, habitaciones, etc.
- **Link**: URL del anuncio de Idealista

## 🛠️ Desarrollo

### Estructura de archivos

```
chrome-extension/
├── manifest.json       # Configuración de la extensión
├── popup.html         # Interfaz del popup
├── popup.js           # Lógica del popup
├── content.js         # Script para extraer datos de Idealista
├── README.md          # Este archivo
└── icons/
    ├── icon16.png     # Ícono 16x16
    ├── icon48.png     # Ícono 48x48
    └── icon128.png    # Ícono 128x128
```

### Modificar la extensión

1. Haz cambios en los archivos
2. Ve a `chrome://extensions/`
3. Haz click en el botón de **recargar** (🔄) de la extensión
4. Prueba los cambios

### API Endpoint

La extensión hace POST a: `/api/apartments/from-extension`

**Headers requeridos:**
```
x-api-key: <tu-email-en-base64>
Content-Type: application/json
```

**Body esperado:**
```json
{
  "title": "Apartamento en Malasaña",
  "address": "Calle San Bernardo 15, Malasaña, Madrid",
  "price": 1200,
  "zone": "Malasaña",
  "notes": "Descripción y características...",
  "link": "https://www.idealista.com/inmueble/...",
  "status": "available",
  "iconColor": "#3B82F6"
}
```

## 🐛 Solución de problemas

### La extensión no extrae datos

1. **Recarga la página de Idealista** - A veces el content script no se carga correctamente
2. **Verifica que estás en una página de anuncio** - La URL debe contener `/inmueble/`
3. **Revisa la consola** - Abre DevTools (F12) y busca errores

### Error de conexión con la API

1. **Verifica que la aplicación esté corriendo** - Abre la URL en tu navegador
2. **Comprueba la API Key** - Usa "Probar conexión" en la configuración
3. **Revisa los permisos CORS** - La API debe aceptar requests desde la extensión

### "API Key inválida"

1. Verifica que tu email esté correctamente codificado en base64
2. Asegúrate de que tu usuario esté **autorizado** (`isAuthorized: true`) en la base de datos
3. Comprueba que el email coincida exactamente con el de tu cuenta

## 🔒 Seguridad

- La API Key se guarda localmente en Chrome usando `chrome.storage.sync`
- Solo usuarios autorizados pueden usar la extensión
- Las peticiones se hacen con HTTPS en producción
- El endpoint valida la API Key en cada request

## 📝 Notas

- La extensión solo funciona en páginas de **Idealista.com**
- Los datos se geocodifican automáticamente en el servidor
- Si la dirección no se puede geocodificar, recibirás un error
- Puedes editar los apartamentos desde la aplicación web

## 🤝 Contribuir

Si encuentras bugs o quieres agregar features:

1. Modifica los archivos necesarios
2. Prueba los cambios
3. Documenta las mejoras

## 📄 Licencia

Este proyecto es parte de la aplicación Mapas Alquiler.

---

**¿Necesitas ayuda?** Revisa la consola del navegador (F12) para ver logs detallados de la extensión.
