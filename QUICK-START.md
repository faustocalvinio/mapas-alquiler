# 🚀 Guía de Inicio Rápido - Extensión de Chrome

## 🎯 Objetivo
Agregar apartamentos de Idealista a tu aplicación con un solo click.

---

## ⚡ Configuración en 3 Minutos

### ✅ Paso 1: Obtén tu API Key (1 min)

**Método más fácil:**
1. Ve a: http://localhost:3000/api-key
2. Copia la API Key que aparece
3. ¡Listo!

**Método alternativo (PowerShell):**
```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("tu-email@gmail.com"))
```

> **Nota:** Usa el mismo email con el que iniciaste sesión en la aplicación

---

### ✅ Paso 2: Instala la Extensión (1 min)

1. Abre Chrome
2. Ve a: `chrome://extensions/`
3. Activa **"Modo de desarrollador"** (toggle arriba derecha)
4. Click en **"Cargar extensión sin empaquetar"**
5. Busca y selecciona la carpeta: `chrome-extension`
6. Verás el ícono 🏠 en tu barra de Chrome

![Instalación](https://via.placeholder.com/600x300?text=Chrome+Extensions)

---

### ✅ Paso 3: Configura la Extensión (1 min)

1. **Click en el ícono** 🏠 de la extensión
2. Ve a la pestaña **"Configuración"**
3. Completa los campos:
   ```
   URL de la API: http://localhost:3000
   API Key: [pega aquí tu key del paso 1]
   ```
4. Click en **"Guardar configuración"**
5. Click en **"Probar conexión"** → Deberías ver: ✅ Conexión exitosa

---

## 🎉 ¡Ya está listo! Ahora úsala

### 📝 Cómo Agregar un Apartamento

1. **Ve a Idealista**: https://www.idealista.com
   
2. **Busca un apartamento** que te guste (por ejemplo, en Madrid)

3. **Abre el anuncio completo** (click en cualquier resultado)
   - ✅ URL correcta: `www.idealista.com/inmueble/12345678...`
   - ❌ URL incorrecta: `www.idealista.com/alquiler-viviendas/...` (listado)

4. **Click en el ícono** 🏠 de la extensión

5. **Click en "📥 Extraer datos"**
   - La extensión leerá automáticamente:
     - Título del inmueble
     - Dirección completa
     - Precio mensual
     - Zona/Barrio
     - Descripción
     - Características

6. **Revisa la vista previa** de los datos extraídos

7. **Click en "💾 Guardar apartamento"**

8. **¡Listo!** 🎊
   - El apartamento aparecerá en tu mapa
   - Puedes verlo en: http://localhost:3000

---

## 🔥 Ejemplos de Anuncios para Probar

Puedes probar con estos ejemplos reales de Idealista:

```
1. Busca "alquiler madrid malasaña"
2. Abre cualquier anuncio
3. Usa la extensión
```

**Tipos de anuncios que funcionan:**
- ✅ Pisos en alquiler
- ✅ Apartamentos
- ✅ Estudios
- ✅ Áticos
- ✅ Lofts

---

## 📊 Ejemplo Visual del Flujo

```
┌──────────────────────────────────────────────────────┐
│  1️⃣  Abres Idealista                                 │
│      └─> Buscas "alquiler madrid"                   │
└──────────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────────┐
│  2️⃣  Abres un anuncio específico                    │
│      └─> www.idealista.com/inmueble/99999999        │
└──────────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────────┐
│  3️⃣  Activas la extensión 🏠                        │
│      └─> Click en el ícono                          │
└──────────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────────┐
│  4️⃣  Extraes los datos                              │
│      ✅ Título: "Piso en Malasaña"                  │
│      ✅ Dirección: "Calle San Bernardo 15"          │
│      ✅ Precio: "1.200€/mes" → 1200                 │
│      ✅ Zona: "Malasaña"                            │
└──────────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────────┐
│  5️⃣  Guardas en tu aplicación                       │
│      └─> Se añade al mapa automáticamente          │
└──────────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────────┐
│  6️⃣  ¡Listo! 🎉                                     │
│      └─> Ve al mapa y verás tu nuevo apartamento   │
└──────────────────────────────────────────────────────┘
```

---

## 🎨 Capturas de Pantalla de la Extensión

### Vista de Extracción
```
┌─────────────────────────────────────────┐
│  🏠 Mapas Alquiler                      │
│  Extractor de Idealista                 │
├─────────────────────────────────────────┤
│  [Extraer] [Configuración]              │
├─────────────────────────────────────────┤
│                                          │
│  ✅ Datos extraídos correctamente       │
│                                          │
│  📋 Vista previa:                       │
│  ┌────────────────────────────────────┐ │
│  │ Título: Piso en Malasaña           │ │
│  │ Dirección: Calle San Bernardo 15   │ │
│  │ Precio: 1200€/mes                  │ │
│  │ Zona: Malasaña                     │ │
│  └────────────────────────────────────┘ │
│                                          │
│  [📥 Extraer datos de esta página]     │
│  [💾 Guardar apartamento]              │
│                                          │
└─────────────────────────────────────────┘
```

### Vista de Configuración
```
┌─────────────────────────────────────────┐
│  🏠 Mapas Alquiler                      │
│  Extractor de Idealista                 │
├─────────────────────────────────────────┤
│  [Extraer] [Configuración]              │
├─────────────────────────────────────────┤
│                                          │
│  URL de la API:                         │
│  [http://localhost:3000            ]   │
│  URL de tu aplicación (sin / final)     │
│                                          │
│  API Key:                               │
│  [dHUtZW1haWxAZXhhbXBsZS5jb20=      ]   │
│  Tu email en base64                     │
│                                          │
│  [Guardar configuración]                │
│  [Probar conexión]                      │
│                                          │
└─────────────────────────────────────────┘
```

---

## 🐛 Solución de Problemas Comunes

### ❌ "API Key inválida"

**Causas posibles:**
1. El email no coincide con tu cuenta
2. Tu usuario no está autorizado
3. La API Key está mal copiada

**Soluciones:**
```
✅ Ve a http://localhost:3000/api-key
✅ Copia de nuevo la API Key (usa el botón "Copiar")
✅ Pégala en la extensión sin espacios extras
✅ Verifica que iniciaste sesión con el mismo email
```

**Verificar en la base de datos:**
```sql
-- Tu usuario debe tener isAuthorized = true
SELECT email, isAuthorized FROM "User" WHERE email = 'tu-email@gmail.com';
```

---

### ❌ La extensión no extrae datos

**Causas posibles:**
1. No estás en una página de anuncio
2. El content script no se cargó
3. Idealista cambió su estructura HTML

**Soluciones:**
```
✅ Recarga la página de Idealista (F5)
✅ Asegúrate de estar en un ANUNCIO, no en el listado
   URL correcta: www.idealista.com/inmueble/12345678
   URL incorrecta: www.idealista.com/alquiler-viviendas/
✅ Recarga la extensión en chrome://extensions/
✅ Abre la consola (F12) y busca errores
```

---

### ❌ "No se pudo geocodificar la dirección"

**Causas posibles:**
1. La dirección no es válida
2. Falta información de ubicación
3. Error temporal de Nominatim

**Soluciones:**
```
✅ Verifica que la dirección incluya "Madrid" o la ciudad
✅ Asegúrate que sea una dirección real
✅ Espera unos segundos e intenta de nuevo
✅ Revisa los logs del servidor para más información
```

---

### ❌ Error de conexión

**Causas posibles:**
1. La aplicación no está corriendo
2. La URL está mal configurada
3. Problema de red/CORS

**Soluciones:**
```
✅ Verifica que la app esté corriendo: http://localhost:3000
✅ Revisa la URL en la configuración de la extensión
✅ Asegúrate de usar http:// o https://
✅ No incluyas / al final de la URL
```

---

## 🎓 Tips y Trucos

### 💡 Tip 1: Atajo de Teclado
- Puedes configurar un atajo para abrir la extensión rápidamente
- Ve a `chrome://extensions/shortcuts`

### 💡 Tip 2: Vista Previa Siempre
- Revisa siempre la vista previa antes de guardar
- Puedes cancelar si los datos no son correctos

### 💡 Tip 3: Múltiples Apartamentos
- Puedes agregar varios apartamentos seguidos
- Abre pestañas con diferentes anuncios
- Usa la extensión en cada una

### 💡 Tip 4: Edición Posterior
- Si algo no sale bien, edita el apartamento en la app
- Ve a http://localhost:3000 → Lista de apartamentos → Editar

### 💡 Tip 5: Notas Automáticas
- La extensión guarda la descripción completa en "Notas"
- También incluye características (m², habitaciones, etc.)

---

## 📱 Uso en Producción

Si subes tu app a producción (ej: Vercel):

1. **Actualiza la URL en la extensión:**
   ```
   Antes: http://localhost:3000
   Ahora: https://tu-app.vercel.app
   ```

2. **La API Key es la misma**
   - No necesitas cambiar nada más

3. **Verifica CORS**
   - Asegúrate de que tu app en producción acepta requests de la extensión

---

## 🎯 Checklist de Primer Uso

Antes de empezar, verifica:

- [ ] ✅ App corriendo en http://localhost:3000
- [ ] ✅ Has iniciado sesión en la app
- [ ] ✅ Tu usuario tiene `isAuthorized: true`
- [ ] ✅ Extensión instalada en Chrome
- [ ] ✅ API Key obtenida y copiada
- [ ] ✅ Configuración guardada en la extensión
- [ ] ✅ Conexión probada (botón "Probar conexión")
- [ ] ✅ Estás en una página de anuncio de Idealista

Si todos los puntos están ✅, ¡estás listo para usar la extensión!

---

## 📞 ¿Necesitas Ayuda?

1. **Revisa la consola del navegador** (F12)
   - Busca mensajes de error en rojo

2. **Revisa los logs del servidor**
   - Ve al terminal donde corre tu app Next.js

3. **Consulta la documentación**
   - `EXTENSION-SETUP.md` - Guía completa
   - `API-TESTING.md` - Pruebas del endpoint
   - `IMPLEMENTATION-SUMMARY.md` - Resumen técnico

4. **Verifica la configuración**
   - Ejecuta: `node validate-setup.js`

---

¡Disfruta agregando apartamentos con un solo click! 🚀🏠
