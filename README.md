# Mapa de Apartamentos Madrid

Una aplicación web para visualizar y gestionar apartamentos en alquiler en Madrid usando un mapa interactivo.

**🌐 Producción:** https://mapa.facal.space/

## 🆕 ¡Nueva Extensión de Chrome!

**Agrega apartamentos desde Idealista con un solo click** 🚀

### URLs Importantes:
> 🌐 **[Producción](https://mapa.facal.space/)** - https://mapa.facal.space/  
> � **[API Key (Producción)](https://mapa.facal.space/api-key)** - Para usar la extensión  
> �📖 **[Guía de inicio rápido](QUICK-START.md)** - Configura en 3 minutos  
> � **[Configuración de Producción](PRODUCTION-READY.md)** - Todo configurado para https://mapa.facal.space  
> � **[Documentación completa](DOC-INDEX.md)** - Todo sobre la extensión

---

## Tecnologías utilizadas

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** para estilos
- **Prisma ORM** para base de datos
- **PostgreSQL** (Neon) como base de datos
- **React Leaflet** para el mapa interactivo
- **OpenStreetMap Nominatim** para geocoding
- **Chrome Extension API** para la extensión de Idealista

## Características

### Aplicación Web
- 🗺️ Mapa interactivo centrado en Madrid
- 🏠 Añadir apartamentos por dirección
- 💰 Filtrar por precio (mínimo/máximo)
- 📍 Filtrar por zona
- 🎯 Geocodificación automática de direcciones
- 📱 Diseño responsive
- 🔐 Autenticación con NextAuth
- 👥 Gestión de ubicaciones personales

### Extensión de Chrome ✨ NUEVO
- 🚀 Extrae datos automáticamente de Idealista
- ⚡ Agrega apartamentos con un click
- 🔑 Autenticación segura con API Key
- 📋 Vista previa antes de guardar
- 🎨 Interfaz moderna y fácil de usar

## Configuración inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar base de datos

1. Crear una cuenta en [Neon](https://neon.tech/)
2. Crear una nueva base de datos PostgreSQL
3. Copiar la URL de conexión

### 3. Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Database
DATABASE_URL="postgresql://usuario:password@host:5432/dbname?sslmode=require"
```

Reemplaza la URL con la proporcionada por Neon.

### 4. Configurar Prisma

```bash
# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones (crear tablas)
npx prisma migrate dev --name init

# (Opcional) Abrir Prisma Studio para ver la base de datos
npx prisma studio
```

## Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Compilar para producción

```bash
npm run build
npm start
```

## Estructura del proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── apartments/
│   │   │   ├── route.ts                    # API endpoints principales
│   │   │   └── from-extension/
│   │   │       └── route.ts                # ✨ API para extensión Chrome
│   │   ├── auth/                           # Autenticación NextAuth
│   │   ├── locations/                      # API de ubicaciones
│   │   └── ...
│   ├── api-key/
│   │   └── page.tsx                        # ✨ Página para obtener API Key
│   ├── components/
│   │   ├── AddApartmentForm.tsx            # Formulario añadir apartamentos
│   │   ├── ApiKeyGenerator.tsx             # ✨ Generador de API Key
│   │   ├── Filters.tsx                     # Componente de filtros
│   │   ├── MapView.tsx                     # Mapa con Leaflet
│   │   ├── AuthButton.tsx                  # Botón de autenticación
│   │   └── ...
│   ├── globals.css                         # Estilos globales
│   ├── layout.tsx                          # Layout principal
│   └── page.tsx                            # Página principal
├── lib/
│   ├── prisma.ts                           # Cliente de Prisma
│   └── auth.ts                             # Configuración NextAuth
chrome-extension/                           # ✨ Extensión de Chrome
├── manifest.json                           # Configuración extensión
├── popup.html                              # UI de la extensión
├── popup.js                                # Lógica del popup
├── content.js                              # Extractor de Idealista
├── icons/                                  # Íconos de la extensión
└── README.md                               # Docs de la extensión
prisma/
└── schema.prisma                           # Esquema de base de datos
```

## API Endpoints

### Aplicación Web

#### GET /api/apartments

Obtener lista de apartamentos con filtros opcionales.

**Parámetros de consulta:**
- `minPrice`: Precio mínimo
- `maxPrice`: Precio máximo
- `zone`: Zona (búsqueda parcial)
- `status`: Estado ("available" o "rented")

#### POST /api/apartments

Crear un nuevo apartamento (requiere autenticación).

**Body (JSON):**
```json
{
  "title": "Opcional: Título del apartamento",
  "address": "Dirección completa en Madrid",
  "price": 1200,
  "zone": "Opcional: Zona (ej. Centro, Malasaña)",
  "notes": "Opcional: Notas adicionales",
  "link": "Opcional: URL del anuncio",
  "status": "available",
  "iconColor": "#3B82F6"
}
```

### Extensión de Chrome ✨

#### POST /api/apartments/from-extension

Crear apartamento desde la extensión de Chrome.

**Headers:**
```
x-api-key: <tu-email-en-base64>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "Piso en Malasaña",
  "address": "Calle San Bernardo 15, Madrid",
  "price": 1200,
  "zone": "Malasaña",
  "notes": "Descripción del inmueble",
  "link": "https://www.idealista.com/inmueble/..."
}
```

#### GET /api/apartments/from-extension

Verificar validez de API Key.

**Headers:**
```
x-api-key: <tu-email-en-base64>
```

📖 **[Ver ejemplos completos de testing](API-TESTING.md)**

## Modelo de datos

### Apartment
```prisma
model Apartment {
  id        String   @id @default(cuid())
  title     String?
  address   String
  price     Int
  zone      String?
  notes     String?
  link      String?
  lat       Float
  lng       Float
  status    String   @default("available")
  iconColor String   @default("#3B82F6")
  createdBy String?
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```

### User
```prisma
model User {
  id            String      @id @default(cuid())
  name          String?
  email         String      @unique
  emailVerified DateTime?
  image         String?
  isAuthorized  Boolean     @default(false)
  password      String?
  userType      String      @default("google")
  accounts      Account[]
  sessions      Session[]
  apartments    Apartment[]
  locations     Location[]
}
```

### Location
```prisma
model Location {
  id          String   @id @default(cuid())
  name        String
  address     String
  type        String   # "work", "metro", "poi", "other"
  description String?
  lat         Float
  lng         Float
  iconColor   String   @default("#EF4444")
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
}
```

## Funcionalidades

### Aplicación Web

#### Añadir apartamento manualmente
1. Completa el formulario con dirección y precio
2. El sistema geocodifica automáticamente la dirección
3. Se añade un marcador en el mapa

#### Añadir desde Idealista 🆕
1. Instala la extensión de Chrome
2. Ve a un anuncio de Idealista
3. Click en el ícono 🏠 de la extensión
4. Click en "Extraer datos" y luego "Guardar"
5. ¡El apartamento aparece en tu mapa!

📖 **[Guía completa de la extensión](QUICK-START.md)**

#### Filtrar apartamentos
- **Por precio**: Establece precio mínimo y/o máximo
- **Por zona**: Busca por nombre de zona
- **Por estado**: Disponible o alquilado

#### Gestionar ubicaciones personales
- Añade lugares importantes (trabajo, metro, etc.)
- Visualiza distancias en el mapa
- Diferentes colores por tipo de ubicación

### Mapa interactivo
- Centrado en Madrid
- Marcadores muestran información del apartamento
- Popup con detalles al hacer clic
- Colores personalizables por apartamento

## Limitaciones y consideraciones

- **Geocoding**: Usa Nominatim (OpenStreetMap) que tiene límites de rate
- **Direcciones**: Funciona mejor con direcciones completas en Madrid
- **Conexión**: Requiere conexión a internet para mapas y geocoding

## Desarrollo futuro

- [x] Autenticación de usuarios (NextAuth)
- [x] Gestión de ubicaciones personales
- [x] Filtros por estado (disponible/alquilado)
- [x] Colores personalizables por apartamento
- [x] **Extensión de Chrome para Idealista** ✨
- [x] API Key para integraciones externas
- [ ] Subida de imágenes
- [ ] Filtros adicionales (habitaciones, m²)
- [ ] Favoritos
- [ ] Notificaciones por email
- [ ] Exportar datos a CSV/JSON
- [ ] Comparador de apartamentos
- [ ] Calculadora de gastos (comisión, depósito, etc.)

## Documentación Adicional

### Extensión de Chrome
- 📖 **[QUICK-START.md](QUICK-START.md)** - Inicio rápido en 3 minutos
- 📚 **[EXTENSION-SETUP.md](EXTENSION-SETUP.md)** - Guía detallada
- 🧪 **[API-TESTING.md](API-TESTING.md)** - Probar el endpoint
- 📊 **[IMPLEMENTATION-SUMMARY.md](IMPLEMENTATION-SUMMARY.md)** - Resumen técnico
- 📑 **[DOC-INDEX.md](DOC-INDEX.md)** - Índice de toda la documentación

### Herramientas
- 🔧 `validate-setup.js` - Validar configuración de la extensión
- 🎨 `chrome-extension/icons/generate-icons.js` - Generar íconos

## Troubleshooting

### Error de conexión a base de datos
- Verifica que `DATABASE_URL` esté correctamente configurada
- Asegúrate de que la base de datos esté accesible

### Mapa no se carga
- Verifica conexión a internet
- Los mapas se cargan del lado del cliente (CSR)

### Geocoding falla
- Usa direcciones más específicas
- Incluye "Madrid" en la dirección
- Verifica límites de rate de Nominatim

## Licencia

MIT
