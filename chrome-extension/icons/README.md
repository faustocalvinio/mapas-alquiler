# Generación de Íconos

## Opción 1: Usar herramientas online (Recomendado)

Sube el archivo `icon.svg` a estas herramientas para generar los PNG:

- **Favicon Generator**: https://www.favicon-generator.org/
- **CloudConvert**: https://cloudconvert.com/svg-to-png
- **Convertio**: https://convertio.co/es/svg-png/

Genera los siguientes tamaños:
- `icon16.png` (16x16px)
- `icon48.png` (48x48px)
- `icon128.png` (128x128px)

## Opción 2: Usar ImageMagick (línea de comandos)

Si tienes ImageMagick instalado:

```bash
# En la carpeta icons/
magick icon.svg -resize 16x16 icon16.png
magick icon.svg -resize 48x48 icon48.png
magick icon.svg -resize 128x128 icon128.png
```

## Opción 3: Usar Inkscape

```bash
inkscape icon.svg -w 16 -h 16 -o icon16.png
inkscape icon.svg -w 48 -h 48 -o icon48.png
inkscape icon.svg -w 128 -h 128 -o icon128.png
```

## Opción 4: Usar Node.js con sharp

```bash
npm install sharp
node generate-icons.js
```

Luego crea `generate-icons.js`:

```javascript
const sharp = require('sharp');
const fs = require('fs');

const sizes = [16, 48, 128];
const svgBuffer = fs.readFileSync('icon.svg');

sizes.forEach(size => {
  sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(`icon${size}.png`)
    .then(() => console.log(`✅ icon${size}.png generado`))
    .catch(err => console.error(`❌ Error generando icon${size}.png:`, err));
});
```

## Nota

Los archivos PNG deben estar en la misma carpeta que este archivo para que la extensión funcione.
