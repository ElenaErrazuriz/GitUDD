h2. Propiedades que no puede ser utilizadas en Bootstrap v.alpha-4.0.3

* "declaration-no-important": true
* "selector-no-universal": true
* "selector-list-comma-newline-after": "always"
* "indentation": true  // debo pasar todos los archivos a spaces y volver a probar
* "no-browser-hacks": [true, {
	"browsers": "browserslist string"
  }]  // Se debe extender para añadir esta propiedad con el listado de browserlist de postcss de bootstrap
* "no-descending-specificity": // Muchos errores
* "no-duplicate-selectors": true // Se podría utilizar
* "no-indistinguishable-colors": [true, {
    "threshold": 1
  }] // Se debe aceptar el uso de rgba()