# 🧪 Guía de prueba para la Extensión de Chrome

## Pre-requisitos

1. Tener el proyecto Next.js corriendo: `npm run dev`
2. Base de datos configurada y migrada
3. Chrome o navegador basado en Chromium

## Paso 1: Generar usuario y API Key

```bash
npm run extension:create-user
```

Esto te pedirá:
- Email del usuario
- Nombre del usuario
- Y generará automáticamente una API Key

**⚠️ IMPORTANTE**: Guarda la API Key que te muestra, no podrás recuperarla después.

## Paso 2: Generar iconos (opcional)

```bash
npm run extension:generate-icons
```

Luego abre el archivo `chrome-extension/icons/generator.html` en tu navegador y descarga los tres iconos.

## Paso 3: Cargar la extensión en Chrome

1. Abre Chrome
2. Ve a `chrome://extensions/`
3. Activa el "Modo de desarrollador" (toggle en la esquina superior derecha)
4. Haz clic en "Cargar extensión sin empaquetar"
5. Selecciona la carpeta `chrome-extension/` de este proyecto
6. ✅ La extensión debería aparecer en tu barra de herramientas

## Paso 4: Configurar la extensión

1. Haz clic en el ícono de la extensión
2. Ingresa la información:
   - **API Key**: La que generaste en el Paso 1
   - **URL del API**: `http://localhost:3000` (o tu URL de producción)
   - **Tasa USD a ARS**: `1500` (o la tasa actual del mercado)
3. Haz clic en "Guardar"
4. Haz clic en "Probar" para verificar que la conexión funciona

## Paso 5: Probar la extensión

### Opción A: Guardar desde detalle de propiedad

1. Ve a ZonaProp: https://www.zonaprop.com.ar
2. Busca cualquier propiedad
3. Abre el detalle de una propiedad
4. Deberías ver un botón flotante "💾 Guardar en Mapas" en la esquina inferior derecha
5. Haz clic en el botón
6. Debería cambiar a "✅ Guardado"
7. Verifica en tu aplicación que la propiedad se guardó

### Opción B: Sincronizar favoritos (si tienes cuenta en ZonaProp)

1. Inicia sesión en ZonaProp
2. Marca algunas propiedades como favoritas
3. Ve a tu página de favoritos
4. Haz clic en el ícono de la extensión
5. Haz clic en "Sincronizar Favoritos"
6. Espera a que termine (verás el progreso)
7. Verifica en tu aplicación que todas las propiedades se guardaron

## Verificar en la aplicación

1. Abre tu aplicación: http://localhost:3000
2. Las nuevas propiedades deberían aparecer en el mapa
3. Deberían tener color verde (#10b981) por defecto
4. Los precios deberían estar en USD
5. En las notas debería indicar que fue importado desde ZonaProp

## Solución de problemas comunes

### Error 401 - No autorizado
- Verifica que la API Key sea correcta
- Verifica que el usuario tenga `isAuthorized: true`

### Error 403 - Forbidden
- El usuario no está autorizado en la base de datos
- Ejecuta el script create-extension-user.js nuevamente

### Error 500 - Error del servidor
- Verifica que el servidor Next.js esté corriendo
- Revisa los logs del servidor para más detalles
- Verifica que la conexión a la base de datos funcione

### No se detectan propiedades
- ZonaProp puede haber cambiado su estructura HTML
- Revisa la consola del navegador (F12) para ver errores
- Los selectores en `content.js` pueden necesitar actualizarse

### CORS error
- Si tu API está en un dominio diferente, configura CORS
- Agrega el origen de la extensión a los headers permitidos

## Debugging

### Ver logs de la extensión

1. Ve a `chrome://extensions/`
2. Busca tu extensión
3. Haz clic en "Inspeccionar vistas: service worker" para ver logs del background
4. Haz clic en "Inspeccionar" en el popup para ver logs del popup
5. En cualquier página de ZonaProp, abre DevTools (F12) para ver logs del content script

### Recargar la extensión

Después de hacer cambios:
1. Ve a `chrome://extensions/`
2. Haz clic en el botón de recarga (🔄) en la tarjeta de tu extensión

## Datos de ejemplo para pruebas

Si necesitas datos de prueba y no quieres usar ZonaProp real:

```javascript
// Puedes ejecutar esto en la consola del popup
const testData = {
  title: "Departamento 2 ambientes en Palermo",
  address: "Av. Santa Fe 3000, Palermo, CABA",
  priceARS: 800000,
  currency: "ARS",
  expenses: 80000,
  rooms: 2,
  bathrooms: 1,
  squareMeters: 45,
  link: "https://www.zonaprop.com.ar/test-property",
  usdRate: 1500
};

// Enviar al API
fetch('http://localhost:3000/api/apartments/extension', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'TU_API_KEY_AQUI'
  },
  body: JSON.stringify(testData)
}).then(r => r.json()).then(console.log);
```

## Checklist de prueba completo

- [ ] Usuario con API Key creado
- [ ] Extensión cargada en Chrome
- [ ] Configuración guardada en la extensión
- [ ] Conexión probada exitosamente
- [ ] Botón flotante aparece en páginas de detalle
- [ ] Guardar una propiedad individual funciona
- [ ] Sincronización masiva funciona (si tienes favoritos)
- [ ] Propiedades aparecen correctamente en la aplicación
- [ ] Precios convertidos a USD correctamente
- [ ] Geocodificación de direcciones funciona
- [ ] No hay duplicados al guardar la misma propiedad dos veces

## Próximos pasos

Una vez que todo funcione:

1. **Actualiza los selectores**: ZonaProp cambia su HTML frecuentemente
2. **Mejora la UI**: Personaliza colores y diseño del popup
3. **Agrega más features**: Categorización automática, filtros, etc.
4. **Deploy**: Si tu API está en producción, actualiza la URL en la configuración

---

¿Algún problema? Revisa el README.md principal de la extensión o consulta los logs del servidor.
