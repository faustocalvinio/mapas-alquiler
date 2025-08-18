# 🔧 SOLUCIÓN COMPLETA ERROR OAuth client was not found

## ❌ ERROR ACTUAL:
```
Error 401: invalid_client
Detalles de la solicitud: flowName=GeneralOAuthFlow
```

## 🎯 CAUSA DEL PROBLEMA:
El error "invalid_client" significa que Google no puede validar tu aplicación OAuth. Esto puede deberse a:

1. **URIs de redirección incorrectas en Google Cloud Console**
2. **Configuración incompleta del consentimiento OAuth**
3. **Credenciales no validadas correctamente**

## 🛠️ SOLUCIÓN PASO A PASO:

### PASO 1: Configurar Google Cloud Console CORRECTAMENTE

1. **Ve a Google Cloud Console:**
   - https://console.cloud.google.com/
   - Selecciona tu proyecto

2. **Configurar la pantalla de consentimiento OAuth:**
   - Ve a "APIs y servicios" > "Pantalla de consentimiento OAuth"
   - Selecciona "Externo" si no tienes un dominio de Google Workspace
   - Completa los campos obligatorios:
     - Nombre de la aplicación: "Mapas Alquiler Madrid"
     - Email de soporte del usuario: tu email
     - Dominios autorizados: `localhost` (para desarrollo)
   - **MUY IMPORTANTE**: Agrega tu email en "Usuarios de prueba"

3. **Configurar las credenciales OAuth:**
   - Ve a "Credenciales"
   - Selecciona tu ID de cliente OAuth existente
   - En "URIs de redireccionamiento autorizados" agrega EXACTAMENTE:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - En "Orígenes autorizados de JavaScript" agrega:
     ```
     http://localhost:3000
     ```

### PASO 2: Verificar tu configuración actual

Tu archivo `.env` actual está correcto:
```env
GOOGLE_CLIENT_ID="469791190180-s1img4m1ncbrfnasi3bisppb0g9hj5gr.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
NEXTAUTH_SECRET="BPx/4cJIx6BsrDQmERJr0mkf1OTpC9RWryZXFv1K6IY="
NEXTAUTH_URL="http://localhost:3000"
AUTHORIZED_EMAILS="facaldevelopment@gmail.com,faustocalvino@gmail.com"
```

### PASO 3: Agregar dominios de prueba

**CRÍTICO**: En Google Cloud Console, en "Pantalla de consentimiento OAuth":
1. Ve a la sección "Usuarios de prueba"
2. Agrega estos emails:
   - `facaldevelopment@gmail.com`
   - `faustocalvino@gmail.com`

### PASO 4: Habilitar APIs necesarias

En Google Cloud Console:
1. Ve a "APIs y servicios" > "Biblioteca"
2. Busca y habilita:
   - "Google+ API" (si está disponible)
   - "People API"
   - "Google OAuth2 API"

### PASO 5: Verificar estado de la aplicación

En "Pantalla de consentimiento OAuth":
- **Estado debe ser**: "En producción" o "En pruebas" 
- Si está en "Borrador", cámbialo a "En pruebas"
- Si es necesario, envía para revisión después

## 🔄 PASOS DE REINICIO:

1. **Guarda todos los cambios en Google Cloud Console**
2. **Espera 5-10 minutos** para que los cambios se propaguen
3. **Reinicia tu servidor de desarrollo:**
   ```bash
   # Detén el servidor (Ctrl+C)
   # Luego:
   npm run dev
   ```
4. **Limpia el caché del navegador:**
   - Abre DevTools (F12)
   - Clic derecho en refresh → "Vaciar caché y realizar recarga forzada"

## 🧪 PRUEBA:

1. Ve a: http://localhost:3000
2. Haz clic en "Continuar con Google"
3. Usa el email: `faustocalvino@gmail.com`

## 📋 CHECKLIST DE VERIFICACIÓN:

- [ ] Pantalla de consentimiento OAuth configurada
- [ ] Usuarios de prueba agregados (tus emails)
- [ ] URIs de redirección exactas: `http://localhost:3000/api/auth/callback/google`
- [ ] Orígenes JavaScript: `http://localhost:3000`
- [ ] APIs habilitadas (People API, OAuth2)
- [ ] Estado de la app: "En pruebas" o "En producción"
- [ ] Servidor reiniciado
- [ ] Caché del navegador limpiado

## 💡 Si sigue fallando:

1. **Crea nuevas credenciales OAuth desde cero**
2. **Verifica que estés usando el proyecto correcto en Google Cloud**
3. **Revisa los logs en la consola del navegador (F12)**
