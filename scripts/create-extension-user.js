const { PrismaClient } = require('@prisma/client');
const readline = require('readline');
const crypto = require('crypto');

const prisma = new PrismaClient();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function createViewerWithApiKey() {
    try {
        console.log('\n🔧 Crear usuario para la extensión de Chrome\n');

        const email = await question('Email del usuario: ');
        const name = await question('Nombre del usuario: ');

        // Generar API Key única
        const apiKey = crypto.randomBytes(32).toString('hex');

        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            console.log('\n⚠️  El usuario ya existe.');
            const update = await question('¿Deseas actualizar su API Key? (s/n): ');

            if (update.toLowerCase() !== 's') {
                console.log('\n❌ Operación cancelada');
                rl.close();
                await prisma.$disconnect();
                return;
            }

            // Actualizar usuario existente
            await prisma.user.update({
                where: { email },
                data: {
                    password: apiKey,
                    isAuthorized: true,
                    userType: 'viewer'
                }
            });

            console.log('\n✅ Usuario actualizado exitosamente!');
        } else {
            // Crear nuevo usuario
            await prisma.user.create({
                data: {
                    email,
                    name,
                    password: apiKey,
                    isAuthorized: true,
                    userType: 'viewer',
                    emailVerified: new Date()
                }
            });

            console.log('\n✅ Usuario creado exitosamente!');
        }

        console.log('\n📋 Detalles del usuario:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`Email: ${email}`);
        console.log(`Nombre: ${name}`);
        console.log(`API Key: ${apiKey}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n⚠️  IMPORTANTE: Guarda esta API Key en un lugar seguro.');
        console.log('   No podrás recuperarla después.\n');
        console.log('📝 Cómo usar:');
        console.log('   1. Abre la extensión de Chrome');
        console.log('   2. Pega esta API Key en el campo "API Key"');
        console.log('   3. Configura la URL del API (ej: http://localhost:3000)');
        console.log('   4. Guarda la configuración\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        rl.close();
        await prisma.$disconnect();
    }
}

// Ejecutar
createViewerWithApiKey();
