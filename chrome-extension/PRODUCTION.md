# 🚀 Configuración para Producción

## Tu Dominio de Producción
**https://mapa.facal.space/**

---

## ✅ Configuración Completada

La extensión ya está configurada para funcionar con tu dominio de producción. Los permisos necesarios han sido agregados al `manifest.json`.

---

## 🔧 Cómo Configurar la Extensión para Producción

### Paso 1: Obtén tu API Key de Producción

Visita tu aplicación en producción:
```
https://mapa.facal.space/api-key
```

1. Inicia sesión con tu cuenta
2. Copia la API Key que aparece
3. Guárdala en un lugar seguro

### Paso 2: Configura la Extensión

1. **Click en el ícono** 🏠 de la extensión
2. Ve a la pestaña **"Configuración"**
3. En el campo **"URL de la API"**, ingresa:
   ```
   https://mapa.facal.space
   ```
   ⚠️ **Importante:** Sin `/` al final

4. En el campo **"API Key"**, pega tu API Key
5. Click en **"Guardar configuración"**
6. Click en **"Probar conexión"** para verificar

### Paso 3: ¡Usar!

Ya puedes agregar apartamentos desde Idealista directamente a tu aplicación en producción.

---

## 🌐 URLs Importantes

### Producción
- **Aplicación:** https://mapa.facal.space/
- **API Key:** https://mapa.facal.space/api-key
- **Ubicaciones:** https://mapa.facal.space/ubicaciones
- **Endpoint API:** https://mapa.facal.space/api/apartments/from-extension

### Desarrollo (Local)
- **Aplicación:** http://localhost:3000/
- **API Key:** http://localhost:3000/api-key
- **Endpoint API:** http://localhost:3000/api/apartments/from-extension

---

## 🔄 Cambiar entre Desarrollo y Producción

Puedes usar la misma extensión para ambos entornos. Solo necesitas:

### Para usar en Producción:
```
URL de la API: https://mapa.facal.space
API Key: [tu-key-de-producción]
```

### Para usar en Desarrollo:
```
URL de la API: http://localhost:3000
API Key: [tu-key-de-desarrollo]
```

> **Tip:** La API Key es la misma si usas el mismo email en ambos entornos.

---

## 🧪 Probar en Producción

### 1. Verificar API Key

**Con cURL (PowerShell):**
```powershell
$apiKey = "tu-api-key-aqui"

curl https://mapa.facal.space/api/apartments/from-extension `
  -H "x-api-key: $apiKey"
```

**Respuesta esperada:**
```json
{
  "valid": true,
  "user": {
    "name": "Tu Nombre",
    "email": "tu@email.com"
  }
}
```

### 2. Agregar un Apartamento de Prueba

```powershell
$apiKey = "tu-api-key-aqui"

curl -X POST https://mapa.facal.space/api/apartments/from-extension `
  -H "Content-Type: application/json" `
  -H "x-api-key: $apiKey" `
  -d '{
    "title": "Apartamento de prueba",
    "address": "Calle Mayor 1, Madrid",
    "price": 1000
  }'
```

---

## 🔒 Seguridad en Producción

### ✅ Permisos HTTPS
- La extensión usa **HTTPS** para todas las comunicaciones con producción
- Tus datos están encriptados en tránsito
- La API Key se transmite de forma segura

### ✅ CORS Configurado
Next.js maneja automáticamente las peticiones CORS de forma segura.

### ✅ Validación de Dominio
El manifest.json incluye explícitamente tu dominio:
```json
"host_permissions": [
  "https://mapa.facal.space/*"
]
```

---

## 📊 Diferencias entre Desarrollo y Producción

| Aspecto | Desarrollo | Producción |
|---------|------------|------------|
| **URL** | http://localhost:3000 | https://mapa.facal.space |
| **Protocolo** | HTTP | HTTPS ✅ |
| **API Key** | Misma (si mismo email) | Misma (si mismo email) |
| **Base de datos** | Local/Dev | Producción (Neon) |
| **Geocoding** | Nominatim | Nominatim |
| **Velocidad** | Instantánea (local) | Según conexión |

---

## 🐛 Troubleshooting en Producción

### Error: "No se puede conectar"

**Posibles causas:**
1. La URL no tiene HTTPS
2. La URL tiene `/` al final
3. Problemas de red/firewall

**Solución:**
```
✅ Verifica: https://mapa.facal.space (sin /)
✅ Prueba abrir la URL en tu navegador
✅ Verifica que la app esté desplegada
```

### Error: "API Key inválida"

**Posibles causas:**
1. Usas API Key de desarrollo en producción (diferente BD)
2. Usuario no autorizado en producción
3. API Key mal copiada

**Solución:**
```
✅ Obtén nueva API Key de: https://mapa.facal.space/api-key
✅ Verifica que tu usuario en producción tenga isAuthorized: true
✅ Copia de nuevo la API Key sin espacios
```

### Error: CORS

**Posibles causas:**
1. Dominio no agregado al manifest
2. Next.js no está manejando CORS

**Solución:**
```
✅ Ya está agregado: "https://mapa.facal.space/*"
✅ Recarga la extensión: chrome://extensions/
✅ Next.js maneja CORS automáticamente
```

---

## 🚀 Despliegue Verificado

La extensión funciona con:
- ✅ **Vercel** (*.vercel.app)
- ✅ **Dominios personalizados** (mapa.facal.space)
- ✅ **Localhost** (desarrollo)
- ✅ **HTTPS** (seguro)

---

## 📝 Checklist de Configuración en Producción

Antes de usar en producción, verifica:

- [ ] ✅ Aplicación desplegada en https://mapa.facal.space
- [ ] ✅ Puedes acceder a https://mapa.facal.space/api-key
- [ ] ✅ Has iniciado sesión en producción
- [ ] ✅ Tu usuario tiene `isAuthorized: true` en la BD de producción
- [ ] ✅ Extensión instalada en Chrome
- [ ] ✅ API Key de producción copiada
- [ ] ✅ URL configurada: `https://mapa.facal.space` (sin /)
- [ ] ✅ Conexión probada y exitosa
- [ ] ✅ Primer apartamento agregado correctamente

---

## 🎯 Flujo Completo en Producción

```
1. Usuario visita: https://mapa.facal.space/api-key
   ↓
2. Inicia sesión y obtiene API Key
   ↓
3. Configura extensión con URL de producción
   ↓
4. Va a Idealista.com
   ↓
5. Abre un anuncio
   ↓
6. Click en extensión 🏠
   ↓
7. Extrae datos
   ↓
8. Guarda apartamento
   ↓
9. POST a: https://mapa.facal.space/api/apartments/from-extension
   ↓
10. ✅ Apartamento guardado en BD de producción
   ↓
11. Visible en: https://mapa.facal.space/
```

---

## 💡 Tips para Producción

### 1. Usa siempre HTTPS
```
✅ https://mapa.facal.space
❌ http://mapa.facal.space
```

### 2. Sin barra al final
```
✅ https://mapa.facal.space
❌ https://mapa.facal.space/
```

### 3. API Key de Producción
- Obtén desde: https://mapa.facal.space/api-key
- No uses la misma si las BD son diferentes

### 4. Prueba primero
- Usa "Probar conexión" antes de agregar apartamentos
- Verifica que veas tu nombre/email en la respuesta

### 5. Monitorea errores
- Abre DevTools (F12) cuando uses la extensión
- Revisa logs del servidor en Vercel

---

## 📞 Soporte

Si tienes problemas en producción:

1. **Verifica el estado de tu app:**
   - https://mapa.facal.space/ debe cargar correctamente

2. **Revisa los logs:**
   - Chrome DevTools (F12)
   - Vercel Dashboard → Logs

3. **Prueba manualmente:**
   - Usa cURL para probar el endpoint
   - Verifica respuestas del servidor

4. **Consulta la documentación:**
   - [EXTENSION-SETUP.md](../EXTENSION-SETUP.md)
   - [API-TESTING.md](../API-TESTING.md)
   - [QUICK-START.md](../QUICK-START.md)

---

## 🎊 ¡Listo para Producción!

Tu extensión está configurada y lista para usar con:
**https://mapa.facal.space/**

**Siguiente paso:**
1. Ve a: https://mapa.facal.space/api-key
2. Obtén tu API Key
3. Configura la extensión
4. ¡Empieza a agregar apartamentos desde Idealista!

---

**Última actualización:** Octubre 2025  
**Dominio:** https://mapa.facal.space/  
**Estado:** ✅ Configurado y listo
