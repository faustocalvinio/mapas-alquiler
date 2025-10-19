# Test del Endpoint de la Extensión

Este archivo contiene ejemplos para probar el endpoint `/api/apartments/from-extension`

## 1. Obtener tu API Key

```javascript
// En la consola del navegador:
btoa("tu-email@example.com")
// O visita: http://localhost:3000/api-key
```

## 2. Probar con cURL (Windows PowerShell)

```powershell
$apiKey = "dHUtZW1haWxAZXhhbXBsZS5jb20="  # Cambia esto por tu API Key

# Probar verificación de API Key (GET)
curl http://localhost:3000/api/apartments/from-extension `
  -H "x-api-key: $apiKey" `
  -H "Content-Type: application/json"

# Agregar un apartamento (POST)
curl -X POST http://localhost:3000/api/apartments/from-extension `
  -H "Content-Type: application/json" `
  -H "x-api-key: $apiKey" `
  -d '{
    "title": "Apartamento de prueba",
    "address": "Calle Mayor 1, Madrid",
    "price": 1200,
    "zone": "Sol",
    "notes": "Este es un apartamento de prueba desde cURL",
    "link": "https://www.idealista.com/inmueble/12345678",
    "status": "available"
  }'
```

## 3. Probar con JavaScript (Fetch API)

```javascript
const apiKey = 'dHUtZW1haWxAZXhhbXBsZS5jb20='; // Tu API Key

// Verificar API Key
fetch('http://localhost:3000/api/apartments/from-extension', {
  method: 'GET',
  headers: {
    'x-api-key': apiKey,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('Verificación:', data))
.catch(err => console.error('Error:', err));

// Agregar apartamento
fetch('http://localhost:3000/api/apartments/from-extension', {
  method: 'POST',
  headers: {
    'x-api-key': apiKey,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: "Piso en Malasaña",
    address: "Calle San Bernardo 15, Malasaña, Madrid",
    price: 1350,
    zone: "Malasaña",
    notes: "Apartamento luminoso con 2 habitaciones",
    link: "https://www.idealista.com/inmueble/99999999",
    status: "available",
    iconColor: "#FF5733"
  })
})
.then(res => res.json())
.then(data => console.log('Resultado:', data))
.catch(err => console.error('Error:', err));
```

## 4. Probar con Postman

### GET - Verificar API Key
```
URL: http://localhost:3000/api/apartments/from-extension
Method: GET
Headers:
  x-api-key: <tu-api-key-en-base64>
  Content-Type: application/json
```

### POST - Agregar Apartamento
```
URL: http://localhost:3000/api/apartments/from-extension
Method: POST
Headers:
  x-api-key: <tu-api-key-en-base64>
  Content-Type: application/json
Body (JSON):
{
  "title": "Apartamento en Chueca",
  "address": "Calle Hortaleza 50, Chueca, Madrid",
  "price": 1400,
  "zone": "Chueca",
  "notes": "Apartamento moderno, recientemente reformado",
  "link": "https://www.idealista.com/inmueble/88888888",
  "status": "available",
  "iconColor": "#3B82F6"
}
```

## 5. Formato de datos esperado

### Campos requeridos:
- `address` (string): Dirección completa del apartamento
- `price` (number | string): Precio mensual (se parseará automáticamente)

### Campos opcionales:
- `title` (string): Título descriptivo
- `zone` (string): Barrio o zona
- `notes` (string): Descripción, características, etc.
- `link` (string): URL del anuncio
- `status` (string): "available" o "rented" (default: "available")
- `iconColor` (string): Color hex (default: "#3B82F6")

## 6. Respuestas

### Success (201):
```json
{
  "success": true,
  "apartment": {
    "id": "clxxxx...",
    "title": "Apartamento en Chueca",
    "address": "Calle Hortaleza 50, Chueca, Madrid",
    "price": 1400,
    "zone": "Chueca",
    "lat": 40.4231,
    "lng": -3.6994,
    "status": "available",
    "iconColor": "#3B82F6",
    "createdBy": "Usuario",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Apartamento creado exitosamente"
}
```

### Error (401):
```json
{
  "error": "API key requerida. Proporciona x-api-key en los headers."
}
```

### Error (403):
```json
{
  "error": "API key inválida o usuario no autorizado"
}
```

### Error (400):
```json
{
  "error": "Dirección y precio son requeridos"
}
```

### Error (400 - Geocoding):
```json
{
  "error": "No se pudo geocodificar la dirección. Verifica que sea válida."
}
```

## 7. Notas importantes

- La API Key es tu email codificado en base64
- Tu usuario debe tener `isAuthorized: true` en la base de datos
- El precio puede ser string (ej: "1.200€") o número, se parseará automáticamente
- La dirección se geocodifica automáticamente usando Nominatim
- Los apartamentos se asocian automáticamente a tu usuario
- El campo `createdBy` se extrae del primer nombre de tu perfil

## 8. Solución de problemas

### "API key inválida"
✅ Verifica que tu email esté correctamente codificado
✅ Comprueba que `isAuthorized: true` en la BD
✅ Asegúrate de usar el header `x-api-key`

### "No se pudo geocodificar"
✅ Verifica que la dirección sea válida
✅ Asegúrate de incluir "Madrid" en la dirección
✅ Revisa los logs del servidor para más info

### Error de CORS
✅ Asegúrate de que la app esté corriendo
✅ Verifica que uses la URL correcta
✅ En producción, configura los CORS apropiadamente
