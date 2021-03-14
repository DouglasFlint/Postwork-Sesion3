// Estructura del CRUD
const router = require('express').Router();
const {
	registroUsuario,
	obtenerUsuarios,
	obtenerUsuarioPorId,
	modificarUsuario,
	eliminarUsuario,
	iniciarSesion, 
	obtenerCamposUsuarios
} = require('../controllers/usuarios');
const auth = require('./auth');

router.get('/', auth.requerido, obtenerUsuarios);
router.get('/campos', auth.requerido, obtenerCamposUsuarios);
router.get('/:id', auth.requerido, obtenerUsuarioPorId);
router.post('/', registroUsuario);
router.post('/entrar', iniciarSesion);
router.put('/:id', auth.requerido, modificarUsuario);
router.delete('/:id', auth.requerido, eliminarUsuario);

module.exports = router;
