// Estructura del CRUD
const router = require('express').Router();
const { crearPelicula, obtenerPeliculas, modificarPelicula, eliminarPelicula } = require('../controllers/peliculas');

router.get('/', obtenerPeliculas);
router.post('/', crearPelicula);
router.put('/:id', modificarPelicula);
router.delete('/:id', eliminarPelicula);

module.exports = router;
