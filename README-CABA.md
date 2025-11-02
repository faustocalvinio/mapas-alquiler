# 🏠 Sistema de Alquileres CABA

Sistema de gestión de apartamentos en alquiler para la Ciudad Autónoma de Buenos Aires (CABA), Argentina.

## 🌟 Características

- 💵 **Gestión de precios dual**: Soporte para USD y ARS con conversión automática (1 USD = 1500 ARS)
- 🗺️ **Mapa interactivo**: Visualización de apartamentos en mapa con Leaflet
- 🏙️ **Específico para CABA**: Incluye todos los barrios de Buenos Aires
- 📊 **Filtros avanzados**: Por barrio, precio, cantidad de ambientes, estado
- 🔐 **Sistema de autenticación**: Con NextAuth.js
- 📱 **Responsive**: Diseño adaptable a dispositivos móviles
- 🌙 **Dark mode**: Soporte para modo oscuro
- 🐳 **Docker**: Base de datos PostgreSQL containerizada

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- Docker y Docker Compose
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd mapas-alquiler
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mapas_alquiler?schema=public"
NEXTAUTH_SECRET="tu-secret-key-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Iniciar la base de datos

```bash
docker-compose up -d
```

### 5. Ejecutar migraciones

```bash
npx prisma migrate dev
npx prisma generate
```

### 6. Iniciar la aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
mapas-alquiler/
├── docker-compose.yml          # Configuración de PostgreSQL
├── prisma/
│   └── schema.prisma          # Schema de la base de datos
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── apartments/    # API de apartamentos
│   │   │   ├── auth/          # Autenticación
│   │   │   └── validate-address/
│   │   ├── components/
│   │   │   ├── AddApartmentFormCABA.tsx
│   │   │   └── ApartmentCard.tsx
│   │   ├── old/               # Versión anterior archivada
│   │   ├── layout.tsx
│   │   └── page.tsx           # Página principal
│   ├── lib/
│   │   ├── auth.ts           # Configuración de NextAuth
│   │   └── prisma.ts         # Cliente de Prisma
│   └── utils/
│       └── apartments.ts     # Utilidades y constantes
└── SETUP-CABA.md             # Guía detallada de configuración
```

## 💰 Sistema de Conversión de Monedas

El sistema soporta precios en USD y ARS con conversión automática:

- **Tipo de cambio**: 1 USD = 1500 ARS (configurable en `src/utils/apartments.ts`)
- Al ingresar un precio en USD, se calcula automáticamente el valor en ARS
- Al ingresar un precio en ARS, se calcula automáticamente el valor en USD
- Los filtros pueden aplicarse en ambas monedas

### Ejemplo de uso:

```typescript
import { usdToArs, arsToUsd, formatUSD, formatARS } from '@/utils/apartments';

// Convertir USD a ARS
const priceARS = usdToArs(500); // 750000 ARS

// Convertir ARS a USD
const priceUSD = arsToUsd(750000); // 500 USD

// Formatear precios
const formattedUSD = formatUSD(500); // "US$ 500"
const formattedARS = formatARS(750000); // "$ 750.000"
```

## 🏗️ Modelo de Datos

### Apartment

```typescript
{
  id: string;
  title?: string;
  address: string;
  priceUSD: number;        // Precio en dólares
  priceARS?: number;       // Precio en pesos (calculado automáticamente)
  currency: string;        // "USD" o "ARS" - moneda original
  zone?: string;           // Barrio de CABA
  neighborhood?: string;   // Sub-zona
  rooms?: number;          // Cantidad de ambientes
  bathrooms?: number;      // Cantidad de baños
  squareMeters?: number;   // Metros cuadrados
  expenses?: number;       // Expensas en ARS
  notes?: string;
  link?: string;
  lat: number;
  lng: number;
  status: string;          // "available", "reserved", "rented"
  iconColor: string;
  createdBy?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 📍 Barrios Soportados

El sistema incluye todos los barrios de CABA:

- Palermo, Recoleta, Belgrano, Caballito, Villa Crespo
- Almagro, Balvanera, San Telmo, Monserrat, Puerto Madero
- Núñez, Colegiales, Villa Urquiza, Villa Devoto, Villa del Parque
- Y 33 barrios más...

Ver lista completa en `src/utils/apartments.ts`

## 🔌 API Endpoints

### Apartamentos

- `GET /api/apartments` - Obtener todos los apartamentos
- `POST /api/apartments` - Crear un apartamento
- `GET /api/apartments/[id]` - Obtener un apartamento específico
- `PATCH /api/apartments/[id]` - Actualizar un apartamento
- `DELETE /api/apartments/[id]` - Eliminar un apartamento

### Validación de Direcciones

- `POST /api/validate-address` - Validar y geocodificar una dirección

## 🛠️ Comandos Útiles

### Base de datos

```bash
# Iniciar PostgreSQL
docker-compose up -d

# Ver logs de la base de datos
docker-compose logs -f postgres

# Detener la base de datos
docker-compose down

# Prisma Studio (GUI para la base de datos)
npx prisma studio

# Crear nueva migración
npx prisma migrate dev --name nombre_de_la_migracion

# Regenerar cliente de Prisma
npx prisma generate
```

### Desarrollo

```bash
# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar en producción
npm start

# Linter
npm run lint
```

## 🔒 Autenticación

El sistema usa NextAuth.js con soporte para:

- Google OAuth
- Credenciales (usuario/contraseña)

Solo los usuarios autorizados pueden agregar, editar o eliminar apartamentos.

## 📝 Versión Anterior

Toda la funcionalidad anterior se encuentra archivada en `/old/` y es accesible en:

- URL: `http://localhost:3000/old`
- Código: `src/app/old/`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto.

## 📧 Contacto

Para más información, consulta `SETUP-CABA.md` o abre un issue.

---

Hecho con ❤️ para Buenos Aires 🇦🇷
