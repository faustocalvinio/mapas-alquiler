# 🔧 Solución: "API key inválida o usuario no autorizado"

## 🎯 El Problema

Ves el error: **"Error: API key inválida o usuario no autorizado"**

Esto sucede porque tu usuario en la base de datos **no está autorizado**.

---

## ✅ Solución Rápida (2 pasos)

### Paso 1: Autoriza tu Usuario

Ejecuta este comando en tu terminal (reemplaza con tu email):

```powershell
node scripts/authorize-user.js tu-email@gmail.com
```

**Ejemplo:**
```powershell
node scripts/authorize-user.js faustocalvinio@gmail.com
```

**Salida esperada:**
```
🔍 Buscando usuario con email: faustocalvinio@gmail.com...

👤 Usuario encontrado:
   Nombre: Fausto
   Email: faustocalvinio@gmail.com
   Autorizado: ❌

🔄 Autorizando usuario...

✅ ¡Usuario autorizado exitosamente!

🔑 Tu API Key para la extensión de Chrome:

   ZmF1c3RvY2FsdmluaW9AZ21haWwuY29t

📋 Copia esta clave y pégala en la extensión.
```

### Paso 2: Usa tu API Key

1. **Copia** la API Key que te dio el script
2. **Abre la extensión** (click en 🏠)
3. **Ve a "Configuración"**
4. **Pega** la API Key
5. **Guarda** y **Prueba conexión**

---

## 🔍 ¿Cómo Saber tu Email?

Si no recuerdas con qué email iniciaste sesión:

### Opción 1: En la Aplicación
1. Ve a: http://localhost:3000/
2. Mira tu perfil (arriba derecha)
3. Ahí aparece tu email

### Opción 2: En la Base de Datos
```sql
-- En Prisma Studio (npx prisma studio)
SELECT email, name, isAuthorized FROM "User";
```

---

## 📊 Verificar que Funcionó

### Prueba 1: Con el Script
```powershell
node scripts/authorize-user.js tu-email@gmail.com
```

Debería decir: **"✅ El usuario ya está autorizado"**

### Prueba 2: Con cURL
```powershell
$apiKey = "tu-api-key-aqui"

curl http://localhost:3000/api/apartments/from-extension `
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

### Prueba 3: Con la Extensión
1. Abre la extensión
2. Configuración → Prueba conexión
3. Debería ver: **"✅ Conexión exitosa! Usuario: Tu Nombre"**

---

## 🐛 Troubleshooting

### "Usuario no encontrado"
**Causa:** No has iniciado sesión en la aplicación

**Solución:**
1. Ve a http://localhost:3000/
2. Inicia sesión con Google o email
3. Luego ejecuta el script de autorización

---

### "Error al decodificar API Key"
**Causa:** La API Key está mal copiada

**Solución:**
1. Ejecuta de nuevo el script: `node scripts/authorize-user.js tu-email@gmail.com`
2. Copia la API Key **completa** (sin espacios)
3. Pégala en la extensión

---

### La extensión sigue dando error
**Causas posibles:**
1. API Key incorrecta
2. Usuario no autorizado
3. URL incorrecta

**Solución:**
```powershell
# 1. Verifica tu usuario
node scripts/authorize-user.js tu-email@gmail.com

# 2. Copia la nueva API Key que te da

# 3. En la extensión:
#    URL: http://localhost:3000
#    API Key: [pega aquí]
#    Guardar → Probar conexión
```

---

## 🎯 Resumen del Flujo

```
1. Inicias sesión en la app
   ↓
2. Tu usuario se crea en la BD (isAuthorized: false por defecto)
   ↓
3. Ejecutas: node scripts/authorize-user.js tu-email@gmail.com
   ↓
4. Script cambia isAuthorized: true
   ↓
5. Script te da tu API Key
   ↓
6. Copias API Key a la extensión
   ↓
7. ¡Funciona! ✅
```

---

## 📝 Para Producción

Cuando despliegues a producción:

1. **Inicia sesión** en https://mapa.facal.space/
2. **Autoriza tu usuario** en producción:
   ```powershell
   # Conecta a tu BD de producción y ejecuta:
   UPDATE "User" SET "isAuthorized" = true WHERE email = 'tu-email@gmail.com';
   ```
3. **Obtén API Key** desde: https://mapa.facal.space/api-key

---

## 🔐 Seguridad

### ¿Por qué necesito estar autorizado?

- Previene que cualquiera use la extensión
- Solo usuarios específicos pueden agregar apartamentos
- Control sobre quién accede a tu aplicación

### ¿Cómo funciona la API Key?

```javascript
// Tu email en base64
const email = "tu-email@gmail.com"
const apiKey = btoa(email) // "dHUtZW1haWxAZ21haWwuY29t"

// El servidor lo decodifica
const decodedEmail = atob(apiKey) // "tu-email@gmail.com"

// Y verifica que exista y esté autorizado
const user = await findUser(decodedEmail)
if (user && user.isAuthorized) {
  // ✅ Permitir acceso
}
```

---

## 💡 Tips

1. **Guarda tu API Key** en un lugar seguro
2. **No la compartas** públicamente
3. **Una API Key por usuario** (basada en email)
4. **Misma API Key** en dev y prod (si usas mismo email)
5. **Regenera** si la olvidas: solo ejecuta el script de nuevo

---

## 📞 Ayuda Adicional

Si sigues teniendo problemas:

1. **Revisa los logs del servidor** (terminal donde corre Next.js)
2. **Abre DevTools** (F12) en la extensión
3. **Ejecuta Prisma Studio:** `npx prisma studio`
   - Verifica que tu usuario tenga `isAuthorized: true`

---

¡Listo! Ahora deberías poder usar la extensión sin problemas 🎉
