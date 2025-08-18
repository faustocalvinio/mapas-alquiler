# 🚨 SOLUCIÓN PARA ERROR: OAuth client was not found

## Problema identificado:
El error "OAuth client was not found" se debe a una configuración incorrecta en Google Cloud Console.

## Pasos para solucionarlo:

### 1. Ve a Google Cloud Console
- Abre: https://console.cloud.google.com/
- Selecciona tu proyecto: "MAPAS-ALQUILER"

### 2. Configura las URIs de redirección EXACTAMENTE así:

En la sección "URIs de redireccionamiento autorizados", agrega estas URLs **EXACTAS**:

```
http://localhost:3000/api/auth/callback/google
```

⚠️ **IMPORTANTE**: 
- NO uses `https` para localhost
- Asegúrate de que no haya espacios al inicio o final
- La URL debe terminar exactamente en `/google`

### 3. Verifica que los dominios autorizados incluyan:

En "Orígenes autorizados de JavaScript":
```
http://localhost:3000
```

### 4. Guarda los cambios
- Haz clic en "GUARDAR" 
- Espera unos segundos para que los cambios se propaguen

### 5. Reinicia tu aplicación de desarrollo
```bash
# Detén el servidor si está corriendo (Ctrl+C)
# Luego ejecuta:
npm run dev
```

### 6. Prueba el login
- Ve a: http://localhost:3000
- Deberías ser redirigido a la página de login
- Usa el email: `faustocalvino@gmail.com` (ahora está autorizado)

## Si sigue sin funcionar:

1. **Verifica que las credenciales en tu .env sean correctas:**
   - `GOOGLE_CLIENT_ID` debe coincidir con el "ID de cliente" en Google Cloud Console
   - `GOOGLE_CLIENT_SECRET` debe coincidir con el "Secreto del cliente"

2. **Borra el caché del navegador:**
   - Abre DevTools (F12)
   - Clic derecho en el botón de refresh
   - Selecciona "Vaciar caché y realizar recarga forzada"

3. **Revisa la consola del navegador:**
   - Abre DevTools (F12)
   - Ve a la pestaña "Console"
   - Busca errores adicionales

## Tu configuración actual (.env):
```env
GOOGLE_CLIENT_ID="469791190180-s1img4m1ncbrfnasi3bisppb0g9hj5gr.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
NEXTAUTH_SECRET="BPx/4cJIx6BsrDQmERJr0mkf1OTpC9RWryZXFv1K6IY="
NEXTAUTH_URL="http://localhost:3000"
AUTHORIZED_EMAILS="facaldevelopment@gmail.com,faustocalvino@gmail.com"
```

✅ **La configuración del código está correcta, solo necesitas ajustar Google Cloud Console.**
