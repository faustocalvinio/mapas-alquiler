# 🏠 Extensión Chrome - ZonaProp to Mapas Alquiler

Extensión de Chrome para guardar automáticamente tus favoritos de ZonaProp en tu aplicación de mapas de alquiler.

## 🌟 Características

- ✅ **Sincronización automática** de favoritos desde ZonaProp
- 💵 **Conversión automática a USD** con tasa configurable
- 🏷️ **Extracción completa de datos**: precio, expensas, ubicación, características
- 🔐 **Autenticación segura** mediante API Key
- 🎯 **Botón flotante** en páginas de detalle para guardar rápidamente
- 📊 **Interfaz intuitiva** para configuración y seguimiento

## 📦 Instalación

### 1. Preparar la extensión

La extensión ya está creada en la carpeta `chrome-extension/`. Solo necesitas cargarla en Chrome.

### 2. Cargar en Chrome

1. Abre Chrome y ve a `chrome://extensions/`
2. Activa el **"Modo de desarrollador"** en la esquina superior derecha
3. Haz clic en **"Cargar extensión sin empaquetar"**
4. Selecciona la carpeta `chrome-extension/` de este proyecto
5. La extensión aparecerá en tu barra de herramientas

### 3. Crear iconos (opcional)

Los iconos se generarán automáticamente, pero puedes crear tus propios iconos personalizados:

- `icons/icon16.png` - 16x16px
- `icons/icon48.png` - 48x48px
- `icons/icon128.png` - 128x128px

Por ahora, puedes usar emojis o crear iconos simples. Ejecuta este comando para crear iconos básicos:

```bash
cd chrome-extension
mkdir -p icons
# Aquí puedes agregar tus propios iconos o usar una herramienta online
```

## 🔧 Configuración

### 1. Generar API Key

Primero necesitas crear un usuario y generar una API Key:

```bash
# Ejecuta desde la raíz del proyecto
npm run create-viewer
```

Esto te pedirá crear un usuario y te dará una API Key. **Guarda esta API Key**, la necesitarás para configurar la extensión.

### 2. Configurar la extensión

1. Haz clic en el ícono de la extensión en Chrome
2. Ingresa tu **API Key** (generada en el paso anterior)
3. Ingresa la **URL del API** (por defecto: `http://localhost:3000`)
4. Configura la **tasa USD/ARS** actual (por defecto: 1500)
5. Haz clic en **"Guardar"**
6. Opcionalmente, haz clic en **"Probar"** para verificar la conexión

## 🚀 Uso

### Método 1: Sincronización masiva

1. Ve a tu página de **favoritos en ZonaProp**
2. Haz clic en el ícono de la extensión
3. Haz clic en **"Sincronizar Favoritos"**
4. La extensión extraerá todos los favoritos visibles y los guardará en tu aplicación

### Método 2: Guardar individualmente

1. Abre cualquier **publicación de ZonaProp**
2. Verás un **botón flotante "💾 Guardar en Mapas"** en la esquina inferior derecha
3. Haz clic para guardar esa propiedad específicamente

## 📊 Datos extraídos

La extensión extrae automáticamente:

- 🏠 **Título** de la propiedad
- 📍 **Dirección completa**
- 💰 **Precio** (en ARS o USD)
- 🏷️ **Expensas**
- 🛏️ **Cantidad de ambientes**
- 🚿 **Cantidad de baños**
- 📐 **Metros cuadrados**
- 🔗 **Link** a la publicación original

## 💱 Conversión de precios

La extensión convierte automáticamente todos los precios a USD:

- Si el precio está en **ARS**: `(Precio + Expensas) / Tasa USD`
- Si el precio está en **USD**: Se suma directamente con las expensas convertidas

**Importante**: Actualiza regularmente la tasa USD/ARS en la configuración para mantener conversiones precisas.

## 🛠️ Desarrollo

### Estructura de archivos

```
chrome-extension/
├── manifest.json       # Configuración de la extensión
├── popup.html          # Interfaz del popup
├── popup.js            # Lógica del popup
├── content.js          # Script que se ejecuta en ZonaProp
├── background.js       # Service worker de fondo
└── icons/             # Iconos de la extensión
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### API Endpoint

La extensión envía datos a: `POST /api/apartments/extension`

Headers requeridos:
```
Content-Type: application/json
X-API-Key: tu-api-key-aqui
```

Body:
```json
{
  "title": "Departamento 2 ambientes",
  "address": "Av. Santa Fe 1234, Palermo",
  "priceARS": 500000,
  "currency": "ARS",
  "expenses": 50000,
  "rooms": 2,
  "bathrooms": 1,
  "squareMeters": 45,
  "link": "https://www.zonaprop.com.ar/...",
  "usdRate": 1500
}
```

## 🐛 Solución de problemas

### La extensión no guarda propiedades

1. **Verifica tu API Key**: Asegúrate de que la API Key sea correcta
2. **Revisa la URL del API**: Debe ser la URL completa sin `/api/apartments`
3. **Comprueba la consola**: Abre DevTools (F12) para ver errores

### No se detectan favoritos

1. Asegúrate de estar en la **página de favoritos** de ZonaProp
2. La estructura de ZonaProp puede cambiar - verifica los selectores en `content.js`
3. Espera a que la página cargue completamente antes de sincronizar

### Error de CORS

Si tu API está en un servidor diferente, asegúrate de configurar CORS correctamente:

```typescript
// En tu API route
headers: {
  'Access-Control-Allow-Origin': 'chrome-extension://*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
}
```

## 🔒 Seguridad

- ✅ La API Key se almacena de forma segura en `chrome.storage.sync`
- ✅ Solo funciona en dominios autorizados (ZonaProp)
- ✅ Todas las peticiones usan HTTPS en producción
- ⚠️ **No compartas tu API Key con nadie**

## 🔄 Actualizar la extensión

1. Haz cambios en los archivos de la extensión
2. Ve a `chrome://extensions/`
3. Haz clic en el botón **"Actualizar"** (🔄) en la tarjeta de tu extensión

## 📝 TODO / Mejoras futuras

- [ ] Soporte para múltiples portales inmobiliarios
- [ ] Detección automática de duplicados más inteligente
- [ ] Sincronización bidireccional
- [ ] Notificaciones de nuevos favoritos
- [ ] Filtros y categorización automática
- [ ] Exportar/importar configuración

## 🤝 Contribuir

Si encuentras bugs o quieres agregar funcionalidades:

1. Modifica los archivos en `chrome-extension/`
2. Prueba los cambios recargando la extensión
3. Documenta los cambios

## 📄 Licencia

Este proyecto es parte de la aplicación Mapas Alquiler.

---

**¿Necesitas ayuda?** Abre un issue en el repositorio o consulta la documentación de la aplicación principal.
