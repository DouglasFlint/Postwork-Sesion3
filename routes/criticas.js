// Estructura del CRUD
const router = require('express').Router();
const {
  crearCritica,
  obtenerCriticas,
  modificarCritica,
  eliminarCritica
} = require('../controllers/criticas')

router.get('/', obtenerCriticas)
router.post('/', crearCritica)
router.put('/:id', modificarCritica)
router.delete('/:id', eliminarCritica)

module.exports = router;