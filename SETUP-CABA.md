# Instrucciones para actualizar la base de datos

## 1. Iniciar la base de datos con Docker

```bash
docker-compose up -d
```

Esto iniciará PostgreSQL en el puerto 5432.

## 2. Configurar la variable de entorno

Asegúrate de tener un archivo `.env` en la raíz del proyecto con:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mapas_alquiler?schema=public"
NEXTAUTH_SECRET="tu-secret-key-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

## 3. Generar el cliente de Prisma

```bash
npm run db:generate
```

## 4. Crear y aplicar la migración

```bash
npx prisma migrate dev --name update_apartment_model_caba
```

Esto:
- Creará una nueva migración con los cambios del schema
- Actualizará la base de datos
- Regenerará el cliente de Prisma

## 5. Verificar que la migración se aplicó correctamente

```bash
npx prisma studio
```

Esto abrirá Prisma Studio donde puedes ver tu base de datos actualizada.

## 6. Iniciar la aplicación

```bash
npm run dev
```

## Notas importantes:

- Si ya tienes datos en la tabla `Apartment`, la migración intentará convertir el campo `price` (Int) a `priceUSD` (Float)
- El campo `priceARS` será calculado automáticamente por la aplicación usando la tasa de conversión
- La moneda por defecto será "USD"
- El tipo de cambio configurado es: 1 USD = 1500 ARS (puedes modificarlo en `src/utils/apartments.ts`)

## Comandos útiles de Docker:

```bash
# Ver logs de la base de datos
docker-compose logs -f postgres

# Detener la base de datos
docker-compose down

# Detener y eliminar los volúmenes (CUIDADO: esto eliminará todos los datos)
docker-compose down -v

# Reiniciar la base de datos
docker-compose restart
```

## Estructura de archivos movidos a /old/

Todos los archivos y rutas anteriores se han movido a `src/app/old/` para mantener el historial:
- `src/app/old/page.tsx` - Página principal antigua
- `src/app/old/components/` - Componentes antiguos
- `src/app/old/admin/` - Panel de administración antiguo
- `src/app/old/apartments/` - API antigua de apartamentos
- `src/app/old/locations/` - API de ubicaciones
- Y todas las demás rutas antiguas

## Cambios principales:

### Schema de Prisma (`prisma/schema.prisma`):
- Campo `price` (Int) → `priceUSD` (Float)
- Nuevo campo `priceARS` (Float, opcional)
- Nuevo campo `currency` (String, default: "USD")
- Nuevos campos específicos de CABA: `neighborhood`, `rooms`, `bathrooms`, `squareMeters`, `expenses`
- Campo `updatedAt` para tracking de cambios

### Utilidades (`src/utils/apartments.ts`):
- Constante `USD_TO_ARS_RATE = 1500`
- Funciones de conversión `arsToUsd()` y `usdToArs()`
- Funciones de formato `formatUSD()` y `formatARS()`
- Lista completa de barrios de CABA (`CABA_NEIGHBORHOODS`)

### API (`src/app/api/apartments/route.ts`):
- GET: Retorna todos los apartamentos con precios normalizados
- POST: Crea apartamentos con conversión automática de moneda
- DELETE: Elimina todos los apartamentos (solo para desarrollo)

### Componentes:
- `ApartmentCard.tsx`: Card mejorada con precios en ambas monedas
- `AddApartmentFormCABA.tsx`: Formulario específico para CABA con todos los campos nuevos
