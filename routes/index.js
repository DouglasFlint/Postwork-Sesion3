// importamos las dependencias necesarias
var router = require('express').Router();

// definimos el comportamiento en la raíz del endpoint
router.get('/', (req, res)=>{
  res.send('welcome to recommendmovie api');
});

router.use('/criticas', require('./criticas'));

/* con el método use de nuestro router estamos indicando 
* que en la ruta 'v1/critiacs' estarán anidadas las rutas 
* que vamos a crear en nuestro archivo criticas.js,
* la función require está importando este archivo */

// exportamos nuestro nuevo router
module.exports = router;
