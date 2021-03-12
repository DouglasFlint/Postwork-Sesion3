// Estructura del CRUD
const router = require('express').Router();
const {
	crearPelicula,
	obtenerPeliculas,
	obtenerPeliculaPorID,
	modificarPelicula,
	eliminarPelicula
} = require('../controllers/peliculas');

router.get('/', obtenerPeliculas); //admite query params
router.post('/', crearPelicula);

router.get('/:id', obtenerPeliculaPorID);
router.delete('/:id', eliminarPelicula);
router.put('/:id', modificarPelicula);

module.exports = router;
