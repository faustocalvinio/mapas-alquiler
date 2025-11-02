# 🇦🇷 Extensión de Chrome para ZonaProp

## Actualización del proyecto

Este proyecto ahora incluye soporte para **Buenos Aires / CABA** y **ZonaProp**. 

### Funcionalidades agregadas:

- ✅ **Extensión de Chrome para ZonaProp**
- ✅ **Endpoint API con autenticación por API Key**
- ✅ **Conversión automática de precios ARS a USD**
- ✅ **Extracción de expensas incluidas**
- ✅ **Sincronización masiva de favoritos**
- ✅ **Geocodificación automática para CABA**

## 🚀 Inicio rápido

### 1. Crear usuario con API Key

```bash
npm run extension:create-user
```

Esto te generará:
- Email y nombre del usuario
- **API Key única** (guárdala, no podrás recuperarla)

### 2. Generar iconos para la extensión

```bash
npm run extension:generate-icons
```

Luego abre `chrome-extension/icons/generator.html` en tu navegador y descarga los iconos.

### 3. Cargar la extensión en Chrome

1. Ve a `chrome://extensions/`
2. Activa "Modo de desarrollador"
3. Haz clic en "Cargar extensión sin empaquetar"
4. Selecciona la carpeta `chrome-extension/`

### 4. Configurar la extensión

1. Haz clic en el ícono de la extensión
2. Ingresa tu API Key
3. Ingresa la URL del API (`http://localhost:3000` o tu URL de producción)
4. Configura la tasa USD/ARS actual
5. Guarda y prueba la conexión

### 5. ¡Usar!

- **Opción A**: Abre cualquier propiedad en ZonaProp y haz clic en el botón flotante "💾 Guardar en Mapas"
- **Opción B**: Ve a tus favoritos en ZonaProp y haz clic en "Sincronizar Favoritos" en la extensión

## 📁 Estructura del proyecto

```
chrome-extension/
├── manifest.json          # Configuración de la extensión
├── popup.html            # Interfaz del popup
├── popup.js              # Lógica del popup
├── content.js            # Script que se ejecuta en ZonaProp
├── background.js         # Service worker de fondo
├── icons/               # Iconos de la extensión
├── README.md            # Documentación detallada
└── TESTING.md           # Guía de pruebas

src/app/api/apartments/extension/
└── route.ts              # Endpoint API con autenticación por API Key
```

## 🔧 Nuevos scripts disponibles

```bash
# Crear usuario para la extensión
npm run extension:create-user

# Generar helper de iconos
npm run extension:generate-icons
```

## 📊 Datos extraídos de ZonaProp

La extensión extrae automáticamente:

- 🏠 Título de la propiedad
- 📍 Dirección completa
- 💰 Precio (en ARS o USD)
- 🏷️ Expensas (si están disponibles)
- 🛏️ Cantidad de ambientes
- 🚿 Cantidad de baños
- 📐 Metros cuadrados
- 🔗 Link a la publicación original

## 💱 Conversión de precios

**Importante**: La extensión convierte automáticamente todos los precios a USD:

- Si el precio está en **ARS**: `(Precio + Expensas) / Tasa USD`
- Si el precio está en **USD**: Se suma directamente con las expensas

**Ejemplo**:
- Precio: ARS 500,000
- Expensas: ARS 50,000
- Tasa: 1500
- **Resultado**: (500,000 + 50,000) / 1500 = **USD 367**

## 🔐 Seguridad

- ✅ API Key almacenada de forma segura en `chrome.storage.sync`
- ✅ Validación de usuario en cada request
- ✅ Solo funciona en dominios autorizados (ZonaProp)
- ⚠️ **Nunca compartas tu API Key**

## 📚 Documentación completa

- **[README de la extensión](chrome-extension/README.md)** - Documentación detallada
- **[TESTING.md](chrome-extension/TESTING.md)** - Guía de pruebas paso a paso
- **[COMO-GENERAR-ICONOS.md](chrome-extension/icons/COMO-GENERAR-ICONOS.md)** - Instrucciones para iconos

## 🐛 Solución de problemas

### La extensión no guarda propiedades

1. Verifica que tu API Key sea correcta
2. Asegúrate de que el servidor esté corriendo
3. Revisa la consola del navegador (F12) para ver errores

### No se detectan propiedades

1. ZonaProp puede haber cambiado su estructura HTML
2. Verifica que estés en una página de listado o detalle de ZonaProp
3. Los selectores en `content.js` pueden necesitar actualizarse

### Error de conexión

1. Verifica que la URL del API sea correcta
2. Si usas HTTPS en producción, asegúrate de configurar CORS
3. Revisa que el endpoint `/api/apartments/extension` esté accesible

## 🔄 Actualizar selectores (si ZonaProp cambia)

Si la extracción deja de funcionar, es probable que ZonaProp haya cambiado su HTML. 

**Para actualizar los selectores**:

1. Abre DevTools en una página de ZonaProp (F12)
2. Usa el inspector de elementos para encontrar los nuevos selectores
3. Actualiza los selectores en `chrome-extension/content.js`
4. Recarga la extensión en `chrome://extensions/`

Selectores principales a verificar:
```javascript
// En extractFromDetailPage() y extractFromListingPage()
'[data-qa="posting PROPERTY"]'      // Cards de propiedades
'[data-qa="POSTING_CARD_PRICE"]'    // Precio
'[data-qa="expensas"]'              // Expensas
'[data-qa="POSTING_CARD_LOCATION"]' // Dirección
'[data-qa="POSTING_CARD_FEATURES"]' // Características
```

## 🚀 Próximos pasos

- [ ] Soporte para más portales inmobiliarios (Mercado Libre, Properati)
- [ ] Detección automática de duplicados mejorada
- [ ] Sincronización bidireccional
- [ ] Notificaciones de nuevos favoritos
- [ ] Categorización automática por zona
- [ ] Exportar/importar configuración

## 📝 Notas de desarrollo

### Endpoint API

El nuevo endpoint acepta requests desde la extensión:

```typescript
POST /api/apartments/extension

Headers:
  Content-Type: application/json
  X-API-Key: tu-api-key

Body:
  {
    title: string
    address: string
    priceARS: number
    currency: 'ARS' | 'USD'
    expenses: number
    rooms: number
    bathrooms: number
    squareMeters: number
    link: string
    usdRate: number
  }
```

### Base de datos

La extensión utiliza el modelo `Apartment` existente. Las propiedades importadas:
- Tienen `iconColor: #10b981` (verde)
- Incluyen notas sobre el precio original
- Se asocian al usuario que creó la API Key
- Intentan geocodificarse automáticamente

## 🤝 Contribuir

Si encuentras bugs o quieres mejorar la extensión:

1. Modifica los archivos en `chrome-extension/`
2. Prueba recargando la extensión
3. Documenta tus cambios
4. Abre un issue o PR en el repositorio

---

**¿Necesitas ayuda?** Revisa la [guía de testing](chrome-extension/TESTING.md) o consulta la documentación completa en la carpeta `chrome-extension/`.
