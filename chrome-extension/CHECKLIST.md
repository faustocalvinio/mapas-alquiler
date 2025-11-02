# 📋 Checklist de instalación - Extensión ZonaProp

Usa esta lista para verificar que todo esté correctamente configurado.

## ✅ Backend (Next.js + API)

- [ ] **Base de datos configurada**
  ```bash
  npm run db:generate
  npm run db:push
  ```

- [ ] **Servidor corriendo**
  ```bash
  npm run dev
  # Debería estar en http://localhost:3000
  ```

- [ ] **Endpoint de extensión accesible**
  - Verifica que `src/app/api/apartments/extension/route.ts` existe
  - El endpoint debería responder en `/api/apartments/extension`

## ✅ Usuario y API Key

- [ ] **Script disponible**
  ```bash
  npm run extension:create-user
  ```

- [ ] **API Key generada**
  - [ ] Email configurado
  - [ ] Nombre configurado
  - [ ] API Key copiada y guardada en lugar seguro
  - [ ] Usuario tiene `isAuthorized: true` en la base de datos

- [ ] **Probar API Key manualmente**
  ```bash
  curl -X POST http://localhost:3000/api/apartments/extension \
    -H "Content-Type: application/json" \
    -H "X-API-Key: TU_API_KEY_AQUI" \
    -d '{"address":"Av. Santa Fe 1000, CABA","priceARS":500000,"currency":"ARS","usdRate":1500}'
  ```

## ✅ Iconos de la extensión

- [ ] **Carpeta de iconos existe**
  ```bash
  ls chrome-extension/icons/
  ```

- [ ] **Script de generación ejecutado**
  ```bash
  npm run extension:generate-icons
  ```

- [ ] **Iconos creados** (opcional pero recomendado)
  - [ ] `chrome-extension/icons/icon16.png`
  - [ ] `chrome-extension/icons/icon48.png`
  - [ ] `chrome-extension/icons/icon128.png`
  - Si no los tienes, abre `chrome-extension/icons/generator.html` en tu navegador

## ✅ Extensión de Chrome

- [ ] **Archivos principales existen**
  - [ ] `chrome-extension/manifest.json`
  - [ ] `chrome-extension/popup.html`
  - [ ] `chrome-extension/popup.js`
  - [ ] `chrome-extension/content.js`
  - [ ] `chrome-extension/background.js`

- [ ] **Extensión cargada en Chrome**
  1. [ ] Abre `chrome://extensions/`
  2. [ ] Activa "Modo de desarrollador"
  3. [ ] Haz clic en "Cargar extensión sin empaquetar"
  4. [ ] Selecciona la carpeta `chrome-extension/`
  5. [ ] La extensión aparece en la barra de herramientas

- [ ] **Extensión configurada**
  1. [ ] Haz clic en el ícono de la extensión
  2. [ ] Ingresa API Key
  3. [ ] Ingresa URL del API (`http://localhost:3000`)
  4. [ ] Configura tasa USD/ARS (ej: `1500`)
  5. [ ] Haz clic en "Guardar"
  6. [ ] Haz clic en "Probar" - debería mostrar "✓ Conexión exitosa"

## ✅ Pruebas funcionales

- [ ] **Botón flotante en ZonaProp**
  1. [ ] Abre cualquier propiedad en ZonaProp
  2. [ ] Verifica que aparece el botón "💾 Guardar en Mapas"
  3. [ ] El botón está visible en la esquina inferior derecha

- [ ] **Guardar propiedad individual**
  1. [ ] Haz clic en "💾 Guardar en Mapas"
  2. [ ] El botón cambia a "⏳ Guardando..."
  3. [ ] Luego cambia a "✅ Guardado"
  4. [ ] Verifica en tu aplicación que la propiedad se guardó

- [ ] **Sincronización masiva** (si tienes favoritos)
  1. [ ] Ve a tu página de favoritos en ZonaProp
  2. [ ] Haz clic en el ícono de la extensión
  3. [ ] Haz clic en "Sincronizar Favoritos"
  4. [ ] Espera a que termine
  5. [ ] Verifica que todas las propiedades se guardaron

- [ ] **Verificar en la aplicación**
  - [ ] Las propiedades aparecen en el mapa
  - [ ] Tienen el color verde (#10b981)
  - [ ] Los precios están en USD
  - [ ] Las notas indican que fueron importadas desde ZonaProp
  - [ ] Las direcciones están geocodificadas

## ✅ Solución de problemas

Si algo no funciona:

- [ ] **Revisar logs del servidor**
  ```bash
  # En la terminal donde corre npm run dev
  # Buscar errores relacionados con /api/apartments/extension
  ```

- [ ] **Revisar logs de la extensión**
  1. [ ] Ve a `chrome://extensions/`
  2. [ ] Busca tu extensión
  3. [ ] Haz clic en "Inspeccionar vistas: service worker"
  4. [ ] Revisa errores en la consola

- [ ] **Revisar logs del content script**
  1. [ ] Abre cualquier página de ZonaProp
  2. [ ] Presiona F12 para abrir DevTools
  3. [ ] Ve a la pestaña Console
  4. [ ] Busca errores relacionados con la extensión

- [ ] **Verificar permisos**
  - [ ] La extensión tiene acceso a `https://www.zonaprop.com.ar/*`
  - [ ] La extensión tiene acceso a tu URL del API

## ✅ Documentación

- [ ] **README leído**
  - [ ] `chrome-extension/README.md` - Documentación principal
  - [ ] `README-EXTENSION-ZONAPROP.md` - Guía de integración
  - [ ] `chrome-extension/TESTING.md` - Guía de pruebas

- [ ] **Scripts conocidos**
  ```bash
  npm run extension:create-user      # Crear usuario con API Key
  npm run extension:generate-icons   # Ayuda para generar iconos
  ```

## ✅ Desarrollo

Si necesitas modificar la extensión:

- [ ] **Conoces la estructura**
  - `manifest.json` - Configuración y permisos
  - `popup.html/js` - Interfaz de configuración
  - `content.js` - Extracción de datos de ZonaProp
  - `background.js` - Service worker de fondo

- [ ] **Sabes cómo recargar**
  1. Haz cambios en cualquier archivo de la extensión
  2. Ve a `chrome://extensions/`
  3. Haz clic en el botón de recarga (🔄) en tu extensión

- [ ] **Selectores actualizables**
  - Si ZonaProp cambia su HTML, actualiza los selectores en `content.js`
  - Referencia: `config.example.js` tiene lista de selectores

## 🎉 ¡Listo!

Si todos los checkboxes están marcados, tu extensión debería estar funcionando perfectamente.

### Siguiente paso: ¡Úsala!

1. Ve a ZonaProp y busca propiedades
2. Guarda tus favoritos con un click
3. Visualízalos en tu aplicación de mapas

### ¿Problemas?

- Revisa la sección de solución de problemas arriba
- Consulta `chrome-extension/TESTING.md` para debugging detallado
- Verifica que todos los servicios estén corriendo

---

**Fecha de última verificación**: ____________

**Notas adicionales**:
_________________________________
_________________________________
_________________________________
