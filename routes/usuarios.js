// Estructura del CRUD
const router = require('express').Router();
const {
	registroUsuario,
	obtenerUsuarios,
	obtenerUsuarioPorId,
	modificarUsuario,
	eliminarUsuario,
	iniciarSesion, 
} = require('../controllers/usuarios');
const auth = require('./auth');
const permissions = require('./permissions');

router.get('/', auth.requerido, obtenerUsuarios);
router.get('/:id', auth.requerido, obtenerUsuarioPorId);
router.post('/', registroUsuario);
router.post('/entrar', iniciarSesion);
router.put('/:id', auth.requerido, permissions, modificarUsuario);
router.delete('/:id', auth.requerido, permissions, eliminarUsuario);

module.exports = router;
