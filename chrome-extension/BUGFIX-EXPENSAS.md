# 🐛 Corrección: Conversión de Expensas a USD

## Problema Identificado

Las expensas en Argentina **siempre se cobran en Pesos Argentinos (ARS)**, incluso cuando el alquiler está cotizado en dólares (USD). 

El código anterior sumaba las expensas al precio antes de convertir, lo que causaba que:
- Para alquileres en USD: las expensas en ARS se trataban como USD (error de conversión)
- El precio total mostrado era incorrecto

### Ejemplo del Bug

**Caso real:**
- Alquiler: USD 500
- Expensas: ARS 50,000
- Tasa de cambio: 1500 ARS/USD

**Comportamiento anterior (incorrecto):**
```
totalPriceARS = 500 + 50000 = 50500
priceUSD = 50500 (se trataba como USD directamente)
// ¡ERROR! Las expensas se multiplicaron por 100
```

## Solución Implementada

### Cambios en `/src/app/api/apartments/extension/route.ts`

Ahora el código:
1. **Convierte el alquiler a USD** según su moneda original
2. **Convierte las expensas a USD** por separado (siempre desde ARS)
3. **Suma ambos valores** ya convertidos a USD

```typescript
// Convertir alquiler según su moneda
if (currency === "USD") {
    priceUSD = priceARS; // Ya está en USD
    finalPriceARS = priceUSD * usdRate;
} else {
    priceUSD = priceARS / usdRate;
    finalPriceARS = priceARS;
}

// Las expensas SIEMPRE están en ARS, convertir por separado
if (expenses && expenses > 0) {
    expensesUSD = expenses / usdRate;
}

// Sumar ambos valores ya convertidos
const totalPriceUSD = priceUSD + expensesUSD;
const totalPriceARS = finalPriceARS + (expenses || 0);
```

### Resultado Correcto

**Caso real con la corrección:**
- Alquiler: USD 500
- Expensas: ARS 50,000
- Tasa de cambio: 1500 ARS/USD

**Comportamiento actual (correcto):**
```
priceUSD = 500 USD
expensesUSD = 50000 / 1500 = 33.33 USD
totalPriceUSD = 500 + 33.33 = 533.33 USD ✅
```

## Beneficios

✅ **Conversión precisa**: Las expensas se convierten correctamente desde ARS a USD  
✅ **Compatibilidad**: Funciona tanto para alquileres en USD como en ARS  
✅ **Transparencia**: Las notas del apartamento muestran el desglose original  
✅ **Sin cambios en la extensión**: La corrección es del lado del servidor

## Pruebas Recomendadas

Después de esta corrección, prueba con:

1. **Alquiler en USD + Expensas en ARS**
   - Ejemplo: USD 600 + ARS 40,000
   - Verificar que el precio total sea ~USD 626

2. **Alquiler en ARS + Expensas en ARS**
   - Ejemplo: ARS 900,000 + ARS 50,000
   - Verificar que el precio total sea ~USD 633 (950,000 / 1500)

3. **Alquiler sin expensas**
   - Verificar que funcione igual que antes

## Fecha de Corrección

📅 2 de noviembre de 2025
