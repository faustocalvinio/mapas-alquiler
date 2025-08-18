-- Script para limpiar datos de autenticación y empezar de cero
-- Ejecutar en el orden indicado

-- 1. Eliminar todas las sesiones
DELETE FROM "Session";

-- 2. Eliminar todas las cuentas OAuth
DELETE FROM "Account";

-- 3. Eliminar todos los usuarios
DELETE FROM "User";

-- 4. Eliminar tokens de verificación
DELETE FROM "VerificationToken";

-- 5. Verificar que las tablas estén vacías
SELECT COUNT(*) as usuarios FROM "User";
SELECT COUNT(*) as cuentas FROM "Account";
SELECT COUNT(*) as sesiones FROM "Session";
SELECT COUNT(*) as tokens FROM "VerificationToken";
