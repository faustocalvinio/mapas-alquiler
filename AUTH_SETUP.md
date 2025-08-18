# Configuración de OAuth con Google

## Instrucciones para configurar la autenticación

### 1. Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ 
4. Ve a "Credenciales" en el menú lateral
5. Clic en "Crear credenciales" > "ID de cliente OAuth"
6. Selecciona "Aplicación web"
7. Agrega estas URIs de redirección autorizadas:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://tu-dominio.com/api/auth/callback/google` (para producción)

### 2. Configurar variables de entorno

Copia el archivo `.env.local` y configura las siguientes variables:

```env
# Database - Configura tu cadena de conexión PostgreSQL
DATABASE_URL="postgresql://usuario:password@localhost:5432/tu_base_de_datos"

# NextAuth.js - Genera una clave secreta única
NEXTAUTH_SECRET="tu-clave-secreta-muy-segura-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth - Obten estos valores de Google Cloud Console
GOOGLE_CLIENT_ID="tu-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"

# Authorized emails - Lista de emails autorizados separados por comas
AUTHORIZED_EMAILS="usuario1@gmail.com,usuario2@gmail.com,usuario3@gmail.com"
```

### 3. Generar NEXTAUTH_SECRET

Ejecuta este comando para generar una clave secreta:

```bash
openssl rand -base64 32
```

O genera una aquí: https://generate-secret.vercel.app/32

### 4. Configurar usuarios autorizados

En la variable `AUTHORIZED_EMAILS`, lista los 3 emails de Google que tendrán acceso a la aplicación, separados por comas:

```env
AUTHORIZED_EMAILS="admin@gmail.com,usuario1@gmail.com,usuario2@gmail.com"
```

### 5. Aplicar migraciones de base de datos

```bash
npx prisma migrate dev
npx prisma generate
```

### 6. Ejecutar la aplicación

```bash
npm run dev
```

## Funcionalidad de autenticación

- Solo los usuarios cuyo email esté en `AUTHORIZED_EMAILS` podrán acceder
- Los usuarios se autentican usando sus cuentas de Google
- Los usuarios no autorizados verán un mensaje de error
- La sesión se mantiene usando cookies seguras
- Los usuarios pueden cerrar sesión desde la interfaz

## Estructura de archivos de autenticación

- `src/lib/auth.ts` - Configuración de NextAuth
- `src/app/api/auth/[...nextauth]/route.ts` - API route de NextAuth
- `src/app/auth/signin/page.tsx` - Página de login
- `src/app/auth/error/page.tsx` - Página de error de autenticación
- `src/app/components/AuthGuard.tsx` - Protección de rutas
- `src/app/components/AuthButton.tsx` - Botón de login/logout
- `src/app/components/SessionProvider.tsx` - Proveedor de sesión
- `src/types/next-auth.d.ts` - Tipos TypeScript extendidos
