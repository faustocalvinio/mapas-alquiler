# Mapa de Apartamentos Madrid

Una aplicación web para visualizar y gestionar apartamentos en alquiler en Madrid usando un mapa interactivo.

## Tecnologías utilizadas

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** para estilos
- **Prisma ORM** para base de datos
- **PostgreSQL** (Neon) como base de datos
- **React Leaflet** para el mapa interactivo
- **OpenStreetMap Nominatim** para geocoding

## Características

- 🗺️ Mapa interactivo centrado en Madrid
- 🏠 Añadir apartamentos por dirección
- 💰 Filtrar por precio (mínimo/máximo)
- 📍 Filtrar por zona
- 🎯 Geocodificación automática de direcciones
- 📱 Diseño responsive

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
│   │   └── apartments/
│   │       └── route.ts          # API endpoints (GET/POST)
│   ├── components/
│   │   ├── AddApartmentForm.tsx   # Formulario para añadir apartamentos
│   │   ├── Filters.tsx            # Componente de filtros
│   │   └── MapView.tsx            # Componente del mapa con Leaflet
│   ├── globals.css                # Estilos globales con Tailwind
│   ├── layout.tsx                 # Layout principal
│   └── page.tsx                   # Página principal
├── lib/
│   └── prisma.ts                  # Cliente de Prisma
prisma/
└── schema.prisma                  # Esquema de base de datos
```

## API Endpoints

### GET /api/apartments

Obtener lista de apartamentos con filtros opcionales.

**Parámetros de consulta:**
- `minPrice`: Precio mínimo
- `maxPrice`: Precio máximo
- `zone`: Zona (búsqueda parcial)

### POST /api/apartments

Crear un nuevo apartamento.

**Body (JSON):**
```json
{
  "title": "Opcional: Título del apartamento",
  "address": "Dirección completa en Madrid",
  "price": 1200,
  "zone": "Opcional: Zona (ej. Centro, Malasaña)"
}
```

## Modelo de datos

```prisma
model Apartment {
  id        String   @id @default(cuid())
  title     String?
  address   String
  price     Int
  zone      String?
  lat       Float
  lng       Float
  createdAt DateTime @default(now())
}
```

## Funcionalidades

### Añadir apartamento
1. Completa el formulario con dirección y precio
2. El sistema geocodifica automáticamente la dirección
3. Se añade un marcador en el mapa

### Filtrar apartamentos
- **Por precio**: Establece precio mínimo y/o máximo
- **Por zona**: Busca por nombre de zona

### Mapa interactivo
- Centrado en Madrid
- Marcadores muestran información del apartamento
- Popup con detalles al hacer clic

## Limitaciones y consideraciones

- **Geocoding**: Usa Nominatim (OpenStreetMap) que tiene límites de rate
- **Direcciones**: Funciona mejor con direcciones completas en Madrid
- **Conexión**: Requiere conexión a internet para mapas y geocoding

## Desarrollo futuro

- [ ] Autenticación de usuarios
- [ ] Subida de imágenes
- [ ] Filtros adicionales (habitaciones, m²)
- [ ] Favoritos
- [ ] Notificaciones por email
- [ ] API de geocoding con mayor cuota

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
