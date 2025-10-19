// Script de validación para verificar la configuración
// Ejecutar: node validate-setup.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Validando configuración de la extensión y API...\n');

const checks = [];

// 1. Verificar archivos de la extensión
const extensionFiles = [
    'chrome-extension/manifest.json',
    'chrome-extension/popup.html',
    'chrome-extension/popup.js',
    'chrome-extension/content.js',
    'chrome-extension/README.md',
    'chrome-extension/icons/icon.svg'
];

console.log('📁 Verificando archivos de la extensión:');
extensionFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    checks.push({ name: file, status: exists });
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// 2. Verificar archivos del API
console.log('\n📁 Verificando archivos del API:');
const apiFiles = [
    'src/app/api/apartments/from-extension/route.ts',
    'src/app/api-key/page.tsx',
    'src/app/components/ApiKeyGenerator.tsx'
];

apiFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    checks.push({ name: file, status: exists });
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// 3. Verificar documentación
console.log('\n📚 Verificando documentación:');
const docFiles = [
    'EXTENSION-SETUP.md',
    'API-TESTING.md',
    'IMPLEMENTATION-SUMMARY.md'
];

docFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    checks.push({ name: file, status: exists });
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// 4. Verificar manifest.json
console.log('\n🔧 Verificando manifest.json:');
try {
    const manifestPath = path.join(__dirname, 'chrome-extension/manifest.json');
    if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

        const manifestChecks = [
            { key: 'name', exists: !!manifest.name },
            { key: 'version', exists: !!manifest.version },
            { key: 'manifest_version', exists: manifest.manifest_version === 3 },
            { key: 'permissions', exists: Array.isArray(manifest.permissions) },
            { key: 'action', exists: !!manifest.action },
            { key: 'content_scripts', exists: Array.isArray(manifest.content_scripts) }
        ];

        manifestChecks.forEach(check => {
            console.log(`  ${check.exists ? '✅' : '❌'} ${check.key}`);
            checks.push({ name: `manifest.${check.key}`, status: check.exists });
        });
    } else {
        console.log('  ❌ manifest.json no encontrado');
    }
} catch (error) {
    console.log('  ❌ Error leyendo manifest.json:', error.message);
}

// 5. Verificar íconos
console.log('\n🎨 Verificando íconos:');
const iconFiles = ['icon16.svg', 'icon48.svg', 'icon128.svg'];
iconFiles.forEach(icon => {
    const exists = fs.existsSync(path.join(__dirname, 'chrome-extension/icons', icon));
    checks.push({ name: `icons/${icon}`, status: exists });
    console.log(`  ${exists ? '✅' : '❌'} ${icon}`);
});

// 6. Resumen
const totalChecks = checks.length;
const passedChecks = checks.filter(c => c.status).length;
const failedChecks = checks.filter(c => !c.status);

console.log('\n' + '='.repeat(60));
console.log(`📊 Resumen: ${passedChecks}/${totalChecks} verificaciones pasadas`);
console.log('='.repeat(60));

if (failedChecks.length > 0) {
    console.log('\n⚠️  Verificaciones fallidas:');
    failedChecks.forEach(check => {
        console.log(`  ❌ ${check.name}`);
    });
}

if (passedChecks === totalChecks) {
    console.log('\n✨ ¡Todo está correctamente configurado!');
    console.log('\n📖 Próximos pasos:');
    console.log('  1. Instalar la extensión en Chrome (chrome://extensions/)');
    console.log('  2. Obtener tu API Key (http://localhost:3000/api-key)');
    console.log('  3. Configurar la extensión');
    console.log('  4. ¡Empezar a agregar apartamentos!');
} else {
    console.log('\n⚠️  Algunos archivos están faltando.');
    console.log('     Revisa la documentación o vuelve a ejecutar la configuración.');
}

console.log('\n');
