# 📌 Guía Rápida: Endpoint y Extensión de Chrome para Idealista

## 🎯 ¿Qué se ha creado?

Se han implementado dos componentes nuevos:

### 1. **Endpoint API** (`/api/apartments/from-extension`)
Permite agregar apartamentos mediante autenticación con API Key.

### 2. **Extensión de Chrome**
Extrae automáticamente datos de anuncios de Idealista y los envía a tu aplicación.

---

## 🚀 Inicio Rápido

### Paso 1: Obtener tu API Key

Tu API Key es tu **email codificado en base64**. Obtén con uno de estos métodos:

**PowerShell (Windows):**
```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("tu-email@example.com"))
```

**Consola del navegador:**
```javascript
btoa("tu-email@example.com")
```

**Online:** https://www.base64encode.org/

⚠️ **Importante:** Tu usuario debe tener `isAuthorized: true` en la base de datos.

---

### Paso 2: Instalar la extensión

1. Abre Chrome y ve a: `chrome://extensions/`
2. Activa el **Modo de desarrollador** (toggle arriba a la derecha)
3. Click en **"Cargar extensión sin empaquetar"**
4. Selecciona la carpeta: `chrome-extension`
5. ¡Listo! Verás el ícono 🏠 en tu barra de herramientas

---

### Paso 3: Configurar la extensión

1. Click en el ícono de la extensión 🏠
2. Ve a la pestaña **Configuración**
3. Ingresa:
   - **URL de la API**: `http://localhost:3000` (o tu URL de producción)
   - **API Key**: El código base64 que obtuviste en el Paso 1
4. Click en **"Guardar configuración"**
5. Click en **"Probar conexión"** para verificar

---

### Paso 4: Usar la extensión

1. Ve a cualquier anuncio de Idealista: `https://www.idealista.com/inmueble/...`
2. Click en el ícono de la extensión 🏠
3. Click en **"📥 Extraer datos de esta página"**
4. Revisa la vista previa
5. Click en **"💾 Guardar apartamento"**
6. ¡El apartamento aparecerá en tu aplicación!

---

## 📁 Archivos Creados

```
mapas-alquiler/
├── src/app/api/apartments/from-extension/
│   └── route.ts                    # ✨ Nuevo endpoint API
│
└── chrome-extension/               # ✨ Nueva carpeta
    ├── manifest.json              # Configuración de la extensión
    ├── popup.html                 # Interfaz de usuario
    ├── popup.js                   # Lógica del popup
    ├── content.js                 # Extractor de datos de Idealista
    ├── README.md                  # Documentación completa
    └── icons/
        ├── icon.svg               # Ícono base SVG
        ├── icon16.svg            # Ícono 16x16 (temporal)
        ├── icon48.svg            # Ícono 48x48 (temporal)
        ├── icon128.svg           # Ícono 128x128 (temporal)
        ├── generate-icons.js      # Script para generar íconos
        ├── generate-icons-sharp.js # Script con sharp
        └── README.md              # Guía de generación de íconos
```

---

## 🔧 Endpoint API

### URL
```
POST /api/apartments/from-extension
GET  /api/apartments/from-extension  (verificar API Key)
```

### Headers
```
x-api-key: <tu-email-en-base64>
Content-Type: application/json
```

### Body (POST)
```json
{
  "title": "Apartamento en Malasaña",
  "address": "Calle San Bernardo 15, Malasaña, Madrid",
  "price": 1200,
  "zone": "Malasaña",
  "notes": "Descripción...",
  "link": "https://www.idealista.com/inmueble/...",
  "status": "available",
  "iconColor": "#3B82F6"
}
```

### Ejemplo con cURL
```bash
curl -X POST http://localhost:3000/api/apartments/from-extension \
  -H "Content-Type: application/json" \
  -H "x-api-key: dHUtZW1haWxAZXhhbXBsZS5jb20=" \
  -d '{
    "address": "Calle Mayor 1, Madrid",
    "price": 1000,
    "title": "Piso céntrico"
  }'
```

---

## 🎨 Generar Íconos PNG (Opcional)

Los íconos SVG funcionan temporalmente. Para íconos PNG finales:

### Opción 1: Online (Más fácil)
1. Ve a: https://www.favicon-generator.org/
2. Sube `chrome-extension/icons/icon.svg`
3. Descarga los PNG generados
4. Renombra como `icon16.png`, `icon48.png`, `icon128.png`
5. Actualiza el `manifest.json` para usar `.png`

### Opción 2: Con Node.js y Sharp
```bash
cd chrome-extension/icons
npm install sharp
node generate-icons-sharp.js
```

### Opción 3: ImageMagick
```bash
cd chrome-extension/icons
magick icon.svg -resize 16x16 icon16.png
magick icon.svg -resize 48x48 icon48.png
magick icon.svg -resize 128x128 icon128.png
```

---

## 🔍 Datos que Extrae la Extensión

- ✅ **Título** del inmueble
- ✅ **Dirección** completa
- ✅ **Precio** mensual (parseado automáticamente)
- ✅ **Zona/Barrio** (extraído de la dirección)
- ✅ **Descripción** completa (guardada en notas)
- ✅ **Características** (m², habitaciones, etc.)
- ✅ **URL** del anuncio

---

## 🐛 Solución de Problemas

### "API Key inválida"
- ✅ Verifica que tu email esté correctamente codificado en base64
- ✅ Asegúrate que tu usuario tenga `isAuthorized: true` en la DB
- ✅ El email debe coincidir exactamente con el de tu cuenta

### "No se pudo geocodificar la dirección"
- ✅ Verifica que la dirección sea válida
- ✅ Asegúrate que incluya "Madrid" o una ciudad reconocible
- ✅ Revisa los logs del servidor para más detalles

### La extensión no extrae datos
- ✅ **Recarga la página** de Idealista (F5)
- ✅ Verifica que estés en una página de **anuncio** (no listado)
- ✅ Abre la consola (F12) y busca errores
- ✅ Recarga la extensión en `chrome://extensions/`

### Error de conexión
- ✅ Verifica que la aplicación esté corriendo
- ✅ Prueba la URL en tu navegador
- ✅ Revisa que no haya errores de CORS

---

## 🔒 Seguridad

- ✅ Autenticación mediante API Key
- ✅ Solo usuarios autorizados pueden usar el endpoint
- ✅ Validación de datos en el servidor
- ✅ API Key guardada localmente en Chrome
- ✅ Soporte para HTTPS en producción

---

## 📝 Próximos Pasos

1. **Prueba la extensión** en varios anuncios de Idealista
2. **Genera los íconos PNG** para una mejor apariencia
3. **Personaliza los colores** o campos según tus necesidades
4. **Comparte la extensión** con tu equipo

---

## 🤝 Soporte

Para más detalles, revisa:
- `chrome-extension/README.md` - Documentación completa de la extensión
- `chrome-extension/icons/README.md` - Guía de generación de íconos

**Logs útiles:**
- Consola del navegador (F12) - Para debugging de la extensión
- Terminal del servidor - Para ver logs del endpoint API

---

¡Disfruta agregando apartamentos con un solo click! 🎉
