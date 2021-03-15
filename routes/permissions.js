const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
module.exports = function(req, res, next) {
	console.log('Hola aqui', req.usuario.id);
	Usuario.findById(req.usuario.id, function(err, user) {
		if (err) {
			return next(err);
		}
		if (user.tipo === 0) {
			res.locals.user = user;
			next();
			console.log('Si tiene permisos de administrador');
		} else if (user.tipo === 1 || user.tipo === 2) {
			res.locals.user = user;
			next();
			console.log('No tiene permisos para acceder');
		}
	});
};
