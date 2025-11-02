
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

```bash
# Instalar ImageMagick si no lo tienes
# Ubuntu/Debian: sudo apt-get install imagemagick
# macOS: brew install imagemagick

cd chrome-extension/icons

# Crear un icono simple con fondo azul
convert -size 128x128 xc:#3b82f6 -gravity center -pointsize 80 -fill white -annotate +0+0 "🏠" icon128.png
convert icon128.png -resize 48x48 icon48.png
convert icon128.png -resize 16x16 icon16.png
```

## Mientras tanto...
La extensión funcionará sin iconos, solo se verá el ícono por defecto de Chrome.
Los iconos son solo para mejorar la apariencia visual.
