# Un jardín para ti

Página romántica independiente para el Día de las Flores Amarillas. Todos sus archivos están en esta carpeta: no depende de la página anterior, sus datos ni su servidor.

## Abrir

Haz doble clic en `index.html`. Funciona directamente, sin instalar paquetes y sin conexión a Internet.

También puedes usar una vista previa local con Node.js:

```powershell
cd C:\dev\ParaMiAmorcito\flores-amarillas
npm start
```

Abre http://localhost:4174. Para probar las fechas: `npm test`.

## Contenido

- `index.html`: portada, jardín con tres mensajes, ramo, cuenta regresiva, carta desplegable y cierre.
- `styles.css`: diseño responsive y animaciones con soporte para movimiento reducido.
- `app.js`: mensajes de flores, partículas, control de animación y actualización del contador.
- `countdown.js`: cálculo de la próxima fecha en la zona horaria local del dispositivo. El 28 de septiembre muestra ceros y el mensaje de llegada durante todo el día; a partir del 29 apunta al año siguiente.
- `assets/`: ilustraciones originales generadas para esta página y favicon.

Los textos se editan en `index.html`; los mensajes interactivos están en los atributos `data-message`. Las ilustraciones son decorativas y el ramo real puede ser diferente. No hay servicios externos, formularios ni recopilación de datos. Para compartir la página puedes alojar esta carpeta en cualquier hosting estático; el servidor incluido es solo para vista previa local.

## Ilustraciones

Generadas con la herramienta integrada ImageGen. Los prompts completos se guardan en `assets/prompts.md`.
