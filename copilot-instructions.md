# Copilot instructions

Propósito

-  Proveer contexto y reglas claras para generar sugerencias de código en este repositorio.

Contexto del proyecto

-  Tipo: Next.js (app router) + TypeScript.
-  Estructura relevante: `src/app/` contiene páginas y layout; `src/app/globals.css` carga estilos globales.
-  Evitar cambios fuera de la estructura existente a menos que se explique.

Preferencias de estilo

-  Usar TypeScript y componentes funcionales de React.
-  Mantener la convención de export por defecto para páginas (`export default function Page()`).
-  Mantener estilos en `globals.css` o archivos CSS junto al componente si es necesario.
-  Evitar reformatos masivos de código no relacionados.

Pruebas y calidad

-  Si añades código que cambia la lógica, añade pruebas unitarias cuando haya infraestructura de testing; si no, agrega una nota para que se evalúe manualmente.
-  No introducir dependencias innecesarias.

# Copilot instructions

Propósito

-  Proveer contexto y reglas claras para generar sugerencias de código en este repositorio.

Resumen rápido del cambio solicitado

-  Stack requerido: Next.js (app router) + TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL (Neon).
-  Funcionalidad principal: mapa de previsualización centrado en Madrid, capacidad de agregar "pisos" (apartamentos) por dirección, mostrar en mapa y filtrar por precio y zona.

Contexto del proyecto

-  Tipo: Next.js (app router) + TypeScript.
-  Estructura relevante: `src/app/` contiene páginas y layout; `src/app/globals.css` carga estilos globales.
-  Mantener la estructura y convenciones del repo; crear `src/app/components/`, `src/lib/`, `src/server/` o similar cuando sea necesario.

Stack y dependencias recomendadas

-  Prisma como ORM.
-  Base de datos PostgreSQL en Neon (usar variable de entorno `DATABASE_URL` con la URL de Neon).
-  Tailwind CSS para estilos.
-  Biblioteca de mapas: Leaflet con `react-leaflet` (opción sin clave) o Mapbox GL (`mapbox-gl` + token si se prefiere). Recomiendo Leaflet + OSM para evitar gestionar claves inicialmente.
-  Servicio de geocoding: OpenStreetMap Nominatim (gratuito, tener en cuenta límites) o un proveedor con clave (Google, Here) si se requiere mayor cuota.

Convenciones y preferencias de estilo

-  Usar TypeScript y componentes funcionales de React.
-  Páginas de Next.js exportadas por defecto: `export default function Page()`.
-  Mantener estilos en `src/app/globals.css` con directivas de Tailwind, o archivos CSS/TSX cercanos al componente si aplica.
-  No introducir reformatos masivos.

Prisma: esquema y flujo recomendado

-  Variable de entorno: `DATABASE_URL` (la URL de Neon). Nunca subirla al VCS.
-  Esquema inicial sugerido (archivo `prisma/schema.prisma`):

```prisma
generator client {
	provider = "prisma-client-js"
}

datasource db {
	provider = "postgresql"
	url      = env("DATABASE_URL")
}

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

-  Comandos útiles (local/powershell): instalar prisma, generar cliente y migrar.

```powershell
npm install prisma --save-dev; npx prisma init
npm install @prisma/client
npx prisma migrate dev --name init
npx prisma generate
```

Notas sobre Neon

-  Neon provee una URL Postgres que debes pegar en `DATABASE_URL` en tu entorno de desarrollo o en la plataforma de despliegue (Vercel/Cloud). No la compartas en el repositorio.

API y backend (Next.js app router + server functions)

-  Rutas API sugeridas (usar `app/api/.../route.ts` o `src/app/api/.../route.ts` con Next.js 13 app router):

-  POST /api/apartments: crear un apartamento. Flujo:

   -  Recibir { address, price, zone, title? }
   -  Llamar a geocoding (Nominatim u otro) para obtener lat/lng desde la dirección.
   -  Guardar en la DB usando Prisma.
   -  Retornar el registro creado.

-  GET /api/apartments: listar apartamentos con filtros opcionales: `?minPrice=...&maxPrice=...&zone=...&bbox=...` (bbox opcional para limitar en el mapa).

-  Ejemplo de contrato corto para las API:
   -  Inputs: JSON con campos mencionados.
   -  Outputs: JSON con el/los apartamentos.
   -  Errores: 400 para entrada inválida, 500 para errores de servidor.

Front-end: páginas y componentes

-  Página principal: `src/app/page.tsx` o `src/app/map/page.tsx` que muestre el mapa centrado en Madrid (lat: 40.4168, lng: -3.7038).
-  Componentes sugeridos:

   -  `src/app/components/MapView.tsx` — wrapper de `react-leaflet`, recibe `apartments` y dibuja markers.
   -  `src/app/components/AddApartmentForm.tsx` — formulario para añadir piso (address, price, zone, title). Envía POST a `api/apartments`.
   -  `src/app/components/Filters.tsx` — inputs para min/max price y selector de zona.

-  Flujo cliente:
   1. Cargar lista de apartamentos (GET /api/apartments) con filtros por defecto.
   2. Mostrar markers en el mapa.
   3. Al crear un nuevo apartamento, hacer POST y refrescar la lista para que aparezca en el mapa.

Geocoding

-  Recomendación inicial: usar Nominatim de OSM para prototipo. Para producción, cambiar a un servicio con mayor cuota y SLA.
-  Ejemplo: llamada a https://nominatim.openstreetmap.org/search?q={encodeURIComponent(address + ' Madrid')} & format=json & limit=1
-  Guardar lat/lng resultantes en la BD.

Filtros en la API

-  Implementar filtros de precio (minPrice, maxPrice) y zona (exacto o búsqueda por LIKE).
-  Opcional: permitir filtrado por bounding box (para renderear solo markers dentro del área visible del mapa).

UI/Estilos: Tailwind

-  Instalar y configurar Tailwind según la documentación oficial de Next.js.
-  Asegurarse de que `src/app/globals.css` incluya las directivas:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Desarrollo incremental y pruebas rápidas

1. Añadir Prisma y el esquema mínimo. Ejecutar `prisma migrate dev` y `prisma generate`.
2. Implementar API POST/GET simples que usen Prisma (sin geocoding al principio: permitir enviar lat/lng manualmente para pruebas).
3. Implementar frontend minimal: mapa centrado en Madrid con un marker estático.
4. Añadir formulario para crear apartamentos; integrar geocoding en el backend.
5. Añadir filtros y mejoras de UX.

Consideraciones y edge cases

-  Direcciones ambiguas o sin resultado de geocoding: retornar error con mensaje y pedir corrección.
-  Límites de rate en geocoding: cachear resultados por dirección si se repiten, y respetar términos de servicio.
-  Validación de entrada: price debe ser número entero positivo; address no vacía.

Seguridad

-  Nunca hardcodear `DATABASE_URL` ni tokens en el repo.
-  Validar y sanitizar entradas antes de persistir.

Entrega y artefactos sugeridos (qué pedir a Copilot o generar automáticamente)

-  `prisma/schema.prisma` (esquema arriba).
-  `src/lib/prisma.ts` — helper para instanciar Prisma Client (singleton) para Next.js.
-  `src/app/api/apartments/route.ts` — handlers GET/POST con Prisma y geocoding.
-  `src/app/components/MapView.tsx`, `AddApartmentForm.tsx`, `Filters.tsx`.
-  Actualizar `src/app/globals.css` para Tailwind.

Ejemplo breve de `src/lib/prisma.ts` (convention):

```ts
import { PrismaClient } from "@prisma/client";

declare global {
   // eslint-disable-next-line no-var
   var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
```

Checklist del requerimiento del usuario

-  [ ] Añadir Prisma y configurar `DATABASE_URL` para Neon. (acción sugerida en los pasos)
-  [ ] Definir esquema `Apartment` en `prisma/schema.prisma`. (incluido arriba)
-  [ ] Implementar API para crear/listar apartamentos con geocoding. (ejemplo de rutas sugeridas)
-  [ ] Integrar mapa centrado en Madrid y mostrar markers. (componentes sugeridos)
-  [ ] Formulario para introducir dirección y filtros por precio/zona. (componentes sugeridos)

¿Qué hago ahora?

-  Puedo aplicar cambios concretos en el repo: crear `prisma/schema.prisma`, `src/lib/prisma.ts`, plantillas de `route.ts` para API, y componentes básicos (MapView, AddApartmentForm, Filters) y configuración de Tailwind.
-  Indica si quieres que use Leaflet + Nominatim (sin claves) o prefieres Mapbox/Google (con token). También dime si quieres que cree las migraciones y ejecute comandos (puedo sugerir los comandos para tu terminal de PowerShell).

Requisitos cobertura

-  Prisma + PostgreSQL (Neon): Instrucciones y esquema incluidos. (Done: instrucción)
-  Tailwind + Next.js: directivas y ubicación señalada. (Done: instrucción)
-  Mapa de Madrid con añadir pisos, ver en mapa, filtrar por precio/zona: diseño de API, DB y componentes sugeridos incluidos. (Done: diseño)

Fin del archivo.
