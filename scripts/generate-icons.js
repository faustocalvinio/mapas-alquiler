// Script simple para generar iconos básicos para la extensión
// Ejecutar con: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'chrome-extension', 'icons');

// Asegurar que el directorio existe
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG template para los iconos
function generateSVG(size) {
    return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#3b82f6" rx="${size * 0.2}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.6}" 
        fill="white" text-anchor="middle" dominant-baseline="central">🏠</text>
</svg>`;
}

// Crear instrucciones para generar iconos
const instructions = `
# 🎨 Generar iconos para la extensión

Los iconos de la extensión no se pueden generar automáticamente con SVG + emoji.
Necesitas crear imágenes PNG de las siguientes dimensiones:

## Tamaños requeridos:
- icon16.png  (16x16 píxeles)
- icon48.png  (48x48 píxeles)
- icon128.png (128x128 píxeles)

## Opciones para crear los iconos:

### Opción 1: Usar una herramienta online (Recomendado)
1. Ve a https://www.favicon-generator.org/
2. Sube una imagen (puede ser un logo o captura de pantalla)
3. Genera los favicons
4. Descarga y renombra a los tamaños necesarios

### Opción 2: Usar Figma/Canva
1. Crea un diseño cuadrado con el emoji 🏠
2. Exporta en los tres tamaños
3. Guarda los archivos en chrome-extension/icons/

### Opción 3: Usar GIMP/Photoshop
1. Crea una imagen cuadrada
2. Agrega el emoji 🏠 o un ícono de casa
3. Exporta en los tres tamaños
4. Guarda en chrome-extension/icons/

### Opción 4: Usar iconos de ejemplo
Mientras tanto, puedes copiar estos comandos para crear iconos básicos
(necesitas tener ImageMagick instalado):

\`\`\`bash
# Instalar ImageMagick si no lo tienes
# Ubuntu/Debian: sudo apt-get install imagemagick
# macOS: brew install imagemagick

cd chrome-extension/icons

# Crear un icono simple con fondo azul
convert -size 128x128 xc:#3b82f6 -gravity center -pointsize 80 -fill white -annotate +0+0 "🏠" icon128.png
convert icon128.png -resize 48x48 icon48.png
convert icon128.png -resize 16x16 icon16.png
\`\`\`

## Mientras tanto...
La extensión funcionará sin iconos, solo se verá el ícono por defecto de Chrome.
Los iconos son solo para mejorar la apariencia visual.
`;

// Guardar instrucciones
fs.writeFileSync(
    path.join(iconsDir, 'COMO-GENERAR-ICONOS.md'),
    instructions
);

console.log('✅ Instrucciones creadas en: chrome-extension/icons/COMO-GENERAR-ICONOS.md');
console.log('\n📝 La extensión funcionará sin iconos, pero se verá mejor con ellos.');
console.log('   Lee el archivo COMO-GENERAR-ICONOS.md para más información.\n');

// Crear iconos placeholder (usando canvas si está disponible)
try {
    // Crear un simple HTML que puede usarse para generar iconos
    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <title>Generador de Iconos</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    canvas { border: 1px solid #ccc; margin: 10px; }
    button { padding: 10px 20px; margin: 5px; }
  </style>
</head>
<body>
  <h1>Generador de Iconos - Extensión Chrome</h1>
  <p>Haz clic en los botones para descargar cada icono</p>
  
  <div>
    <canvas id="canvas16" width="16" height="16"></canvas>
    <button onclick="download(16)">Descargar 16x16</button>
  </div>
  
  <div>
    <canvas id="canvas48" width="48" height="48"></canvas>
    <button onclick="download(48)">Descargar 48x48</button>
  </div>
  
  <div>
    <canvas id="canvas128" width="128" height="128"></canvas>
    <button onclick="download(128)">Descargar 128x128</button>
  </div>

  <script>
    function drawIcon(size) {
      const canvas = document.getElementById('canvas' + size);
      const ctx = canvas.getContext('2d');
      
      // Fondo azul con bordes redondeados
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, size * 0.2);
      ctx.fill();
      
      // Emoji de casa
      ctx.font = (size * 0.6) + 'px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🏠', size / 2, size / 2);
    }
    
    function download(size) {
      const canvas = document.getElementById('canvas' + size);
      const link = document.createElement('a');
      link.download = 'icon' + size + '.png';
      link.href = canvas.toDataURL();
      link.click();
    }
    
    // Dibujar los iconos al cargar
    drawIcon(16);
    drawIcon(48);
    drawIcon(128);
  </script>
</body>
</html>
  `;

    fs.writeFileSync(
        path.join(iconsDir, 'generator.html'),
        htmlTemplate
    );

    console.log('✅ Generador HTML creado: chrome-extension/icons/generator.html');
    console.log('   Abre este archivo en tu navegador para descargar los iconos.\n');

} catch (error) {
    console.error('Error creando archivos:', error.message);
}
