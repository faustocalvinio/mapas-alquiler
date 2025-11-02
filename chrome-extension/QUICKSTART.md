# 🚀 Inicio Rápido - Extensión ZonaProp

## Setup en 3 pasos (5 minutos)

### 1️⃣ Crear usuario y API Key (1 min)

```bash
npm run extension:create-user
```

Copia y guarda tu API Key. La necesitarás en el paso 3.

### 2️⃣ Cargar extensión en Chrome (2 min)

1. Abre `chrome://extensions/`
2. Activa "Modo de desarrollador" (toggle arriba a la derecha)
3. Clic en "Cargar extensión sin empaquetar"
4. Selecciona la carpeta `chrome-extension/`

### 3️⃣ Configurar (2 min)

1. Clic en el ícono de la extensión (en la barra de Chrome)
2. Completa:
   - **API Key**: La que generaste en el paso 1
   - **URL**: `http://localhost:3000`
   - **Tasa USD**: `1500` (o la actual del mercado)
3. Clic en "Guardar" y luego "Probar"

### ✅ ¡Listo para usar!

**Opción A - Guardar individual:**
1. Abre cualquier propiedad en ZonaProp
2. Clic en el botón flotante "💾 Guardar en Mapas"

**Opción B - Sincronización masiva:**
1. Ve a tus favoritos en ZonaProp
2. Clic en el ícono de la extensión
3. Clic en "Sincronizar Favoritos"

---

## 📁 Archivos principales

```
chrome-extension/
├── manifest.json       → Configuración de la extensión
├── popup.html/js       → Interfaz de configuración
├── content.js          → Extrae datos de ZonaProp
├── background.js       → Maneja peticiones al API
└── README.md           → Documentación completa
```

## 🛠️ Comandos útiles

```bash
# Crear usuario con API Key
npm run extension:create-user

# Ayuda para generar iconos
npm run extension:generate-icons

# Iniciar servidor (requerido para que funcione)
npm run dev
```

## 🐛 ¿Algo no funciona?

1. ✅ Verifica que el servidor esté corriendo (`npm run dev`)
2. ✅ Verifica que la API Key sea correcta
3. ✅ Abre DevTools (F12) en ZonaProp y busca errores
4. ✅ Lee `TESTING.md` para debugging detallado

## 📚 Más ayuda

- **Documentación completa**: `chrome-extension/README.md`
- **Guía de pruebas**: `chrome-extension/TESTING.md`
- **Checklist completo**: `chrome-extension/CHECKLIST.md`

---

**¿Preguntas?** Revisa la documentación o abre un issue en el repositorio.
