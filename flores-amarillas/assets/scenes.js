/* Activa una escena solo después de guardar su imagen en assets/.
   Ejemplo: bench: { src: 'assets/garden-bench.png', alt: 'Una banca entre flores amarillas con dos gatos machos: uno crema y otro naranja con blanco.' }
   Los valores null conservan jardin.png sin solicitar archivos inexistentes.
   Las composiciones y los prompts completos están en assets/prompts.md. */
globalThis.GardenScenes = Object.freeze({
  bench: null,
  night: null
});
