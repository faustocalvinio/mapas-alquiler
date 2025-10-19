// Script para generar íconos PNG desde SVG
// Ejecutar: node generate-icons.js

const fs = require('fs');
const path = require('path');

console.log('🎨 Generando íconos para la extensión de Chrome...\n');

// Crear imágenes PNG simples usando Canvas en Node.js o placeholders
const sizes = [16, 48, 128];

// Función para crear un PNG simple con canvas
function createSimplePNG(size, filename) {
    // Como alternativa simple, creamos un data URL que Chrome puede usar
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="${size}" height="${size}">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="24" fill="url(#grad1)"/>
  <g transform="translate(24, 32)">
    <path d="M 40 10 L 10 35 L 15 35 L 15 65 L 65 65 L 65 35 L 70 35 Z" fill="white" stroke="white" stroke-width="2"/>
    <rect x="50" y="20" width="8" height="12" fill="white"/>
    <rect x="32" y="45" width="16" height="20" fill="#667eea" rx="2"/>
    <rect x="20" y="42" width="8" height="8" fill="#667eea" rx="1"/>
    <rect x="52" y="42" width="8" height="8" fill="#667eea" rx="1"/>
  </g>
  <circle cx="100" cy="100" r="16" fill="white"/>
  <path d="M 100 92 L 100 108 M 92 100 L 108 100" stroke="#667eea" stroke-width="4" stroke-linecap="round"/>
</svg>`;

    // Guardar como SVG (Chrome puede usar SVG directamente en algunos casos)
    fs.writeFileSync(filename.replace('.png', '.svg'), svg);
    console.log(`✅ ${path.basename(filename.replace('.png', '.svg'))} creado (${size}x${size})`);
}

console.log('📝 NOTA: Chrome puede usar archivos SVG temporalmente.');
console.log('   Para íconos PNG definitivos, usa una de estas opciones:\n');
console.log('   1. Sube icon.svg a https://www.favicon-generator.org/');
console.log('   2. Instala sharp: npm install sharp && node generate-icons-sharp.js');
console.log('   3. Usa ImageMagick: magick icon.svg -resize <size> icon<size>.png\n');

sizes.forEach(size => {
    const filename = path.join(__dirname, `icon${size}.png`);
    createSimplePNG(size, filename);
});

console.log('\n✨ Proceso completado!');
console.log('⚠️  Recuerda: Los archivos SVG son temporales.');
console.log('   Genera los PNG finales antes de publicar la extensión.\n');
