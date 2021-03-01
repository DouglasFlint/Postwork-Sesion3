// importamos las dependencias necesarias
var router = require('express').Router();

// definimos el comportamiento en la raíz del endpoint
router.get('/', (req, res) => {
	res.send('Welcome to recommendmovie API 🎬');
});

router.use('/criticas', require('./criticas'));
router.use('/usuarios', require('./usuarios'));
router.use('/peliculas', require('./peliculas'));

/* con el método use de nuestro router estamos indicando 
* que en la ruta 'v1/criticas' estarán anidadas las rutas 
* que vamos a crear en nuestro archivo criticas.js,
* la función require está importando este archivo */

// exportamos nuestro nuevo router
module.exports = router;
