// Estructura del CRUD
const router = require('express').Router();
const { crearCritica, obtenerCriticas, modificarCritica, eliminarCritica } = require('../controllers/criticas');

const auth = require('./auth');

router.get('/:peliculaID', auth.opcional, obtenerCriticas); //Obtener las críticas de una película
router.post('/', auth.requerido, crearCritica); //Crear una crítica
router.put('/:id', auth.requerido, modificarCritica); //Modificar una crítica
router.delete('/:id', auth.requerido, eliminarCritica); //Eliminar una crítica

module.exports = router;
