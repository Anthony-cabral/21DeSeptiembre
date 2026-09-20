# 21 de septiembre · Viaje 3D de flores amarillas

Experiencia romántica hecha con HTML5, CSS3, JavaScript y Three.js 3D.

## Qué incluye

- Pantalla inicial oscura con **EMPEZAR VIAJE**.
- Al tocarla, inicia la música y un túnel 3D de flores, pétalos, destellos, frases y recuerdos.
- Tus fotos reales aparecen como Polaroids flotando dentro del viaje.
- El viaje acelera y termina entrando al jardín.
- Galería de momentos, mensajes interactivos, ramo, cuenta regresiva al 28 y carta.
- Diseño responsive para móvil y escritorio.

## Ejecutar

```bash
npm install
npm start
```

Abrir `http://localhost:4174`.

## Render

Si el repositorio mantiene la carpeta `flores-amarillas`, usa:

- Root Directory: `flores-amarillas`
- Build Command: `npm install`
- Start Command: `npm start`

El servidor usa `no-cache, no-store`, para evitar que Render/navegador siga mostrando imágenes antiguas con el mismo nombre.

## Música

Incluí `assets/audio/jardin-dorado.mp3`, una pista instrumental original para que la experiencia funcione de inmediato.

La página intenta primero cargar:

`assets/audio/flores-amarillas.mp3`

Si tienes una copia de audio que tengas derecho a usar, colócala con ese nombre y se reproducirá al tocar **EMPEZAR VIAJE**. Si ese archivo no existe, se reproduce automáticamente `jardin-dorado.mp3`.

## Three.js

La escena 3D carga Three.js desde jsDelivr. El navegador necesita conexión a Internet para esa librería.
