// Estructura del CRUD
const router = require('express').Router();
const {
	crearPelicula,
	obtenerPeliculas,
	obtenerPeliculaPorID,
	obtenerCamposPeliculas,
	modificarPelicula,
	eliminarPelicula
} = require('../controllers/peliculas');
const auth = require('./auth');
const permissions = require('./permissions');

router.get('/', obtenerPeliculas); //admite query params
router.post('/', auth.requerido, permissions, crearPelicula);

router.get('/:id', obtenerPeliculaPorID);
router.delete('/:id', auth.requerido, permissions, eliminarPelicula);
router.put('/:id', modificarPelicula);

module.exports = router;
