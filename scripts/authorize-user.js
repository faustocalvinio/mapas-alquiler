// Script para autorizar usuario
// Ejecutar: node scripts/authorize-user.js tu-email@gmail.com

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function authorizeUser(email) {
    if (!email) {
        console.error('❌ Error: Debes proporcionar un email');
        console.log('\n📖 Uso: node scripts/authorize-user.js tu-email@gmail.com\n');
        process.exit(1);
    }

    try {
        console.log(`🔍 Buscando usuario con email: ${email}...`);

        // Buscar usuario
        let user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.log(`\n⚠️  Usuario no encontrado. ¿Quieres crearlo? (S/n)`);
            console.log('   Por favor, primero inicia sesión en la aplicación.\n');
            process.exit(1);
        }

        console.log(`\n👤 Usuario encontrado:`);
        console.log(`   Nombre: ${user.name || 'Sin nombre'}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Autorizado: ${user.isAuthorized ? '✅' : '❌'}`);

        if (user.isAuthorized) {
            console.log(`\n✅ El usuario ya está autorizado. No es necesario hacer cambios.\n`);

            // Mostrar API Key
            const apiKey = Buffer.from(user.email).toString('base64');
            console.log(`🔑 API Key para la extensión:`);
            console.log(`   ${apiKey}\n`);

            process.exit(0);
        }

        // Autorizar usuario
        console.log(`\n🔄 Autorizando usuario...`);

        user = await prisma.user.update({
            where: { email },
            data: { isAuthorized: true }
        });

        console.log(`\n✅ ¡Usuario autorizado exitosamente!`);

        // Mostrar API Key
        const apiKey = Buffer.from(user.email).toString('base64');
        console.log(`\n🔑 Tu API Key para la extensión de Chrome:`);
        console.log(`\n   ${apiKey}\n`);
        console.log(`📋 Copia esta clave y pégala en la extensión.\n`);
        console.log(`📖 Instrucciones:`);
        console.log(`   1. Abre la extensión (click en 🏠)`);
        console.log(`   2. Ve a la pestaña "Configuración"`);
        console.log(`   3. Pega la API Key`);
        console.log(`   4. Guarda y prueba la conexión\n`);

    } catch (error) {
        console.error(`\n❌ Error:`, error.message);
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Obtener email de los argumentos
const email = process.argv[2];

if (!email) {
    console.log('\n🔐 Script de Autorización de Usuarios\n');
    console.log('📖 Uso:');
    console.log('   node scripts/authorize-user.js tu-email@gmail.com\n');
    console.log('📝 Ejemplo:');
    console.log('   node scripts/authorize-user.js faustocalvinio@gmail.com\n');
    process.exit(1);
}

authorizeUser(email);
