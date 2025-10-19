// Script alternativo usando sharp para generar íconos PNG de alta calidad
// Instalar: npm install sharp
// Ejecutar: node generate-icons-sharp.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

console.log('🎨 Generando íconos PNG con sharp...\n');

const sizes = [16, 48, 128];
const svgPath = path.join(__dirname, 'icon.svg');

if (!fs.existsSync(svgPath)) {
    console.error('❌ Error: icon.svg no encontrado');
    process.exit(1);
}

const svgBuffer = fs.readFileSync(svgPath);

async function generateIcons() {
    for (const size of sizes) {
        try {
            const outputPath = path.join(__dirname, `icon${size}.png`);

            await sharp(svgBuffer)
                .resize(size, size)
                .png()
                .toFile(outputPath);

            console.log(`✅ icon${size}.png generado (${size}x${size})`);
        } catch (error) {
            console.error(`❌ Error generando icon${size}.png:`, error.message);
        }
    }

    console.log('\n✨ ¡Todos los íconos generados correctamente!');
}

generateIcons().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
