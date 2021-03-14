/*  Archivo controllers/usuarios.js*/
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const passport = require('passport');

function registroUsuario(req, res, next) {
	// Instancia de usuario utilizando la clase Usuario
	const body = req.body,
		password = body.password;
	delete body.password;
	const usuario = new Usuario(body);
	usuario.crearPassword(password);
	usuario
		.save()
		.then((user) => {
			return res.status(201).json(user.toAuthJSON());
		})
		.catch(next);
}

function obtenerUsuarioPorId(req, res, next) {
	Usuario.findById(req.usuario.id, (err, user) => {
		if (!user || err) {
			return res.status(401).send('Error, el usuario no existe');
		}
		return res.status(200).json(user.publicData());
	}).catch(next);
}

function obtenerUsuarios(req, res, next) {
	Usuario.find({}, (err, users) => {
		if (!users.length || err) {
			return res.status(404).send('Ninguna conincidencia fué encontrada');
		}
		var userMap = {};

		users.forEach(function(user) {
			userMap[user._id] = user.publicData();
		});

		res.status(200).send(userMap);
	}).catch(next);
}

function modificarUsuario(req, res, next) {
	// console.log(req.usuario);
	Usuario.findById(req.usuario.id)
		.then((user) => {
			if (!user) {
				return res.status(401);
			}
			let nuevaInfo = req.body;
			if (typeof nuevaInfo.username !== 'undefined') user.username = nuevaInfo.username;
			if (typeof nuevaInfo.nombre !== 'undefined') user.nombre = nuevaInfo.nombre;
			if (typeof nuevaInfo.apellido !== 'undefined') user.apellido = nuevaInfo.apellido;
			if (typeof nuevaInfo.genero !== 'undefined') user.genero = nuevaInfo.genero;
			if (typeof nuevaInfo.edad !== 'undefined') user.edad = nuevaInfo.edad;
			if (typeof nuevaInfo.tipo !== 'undefined') user.tipo = nuevaInfo.tipo;
			if (typeof nuevaInfo.password !== 'undefined') user.crearPassword(nuevaInfo.password);
			user
				.save()
				.then((updatedUser) => {
					res.status(201).json(updatedUser.publicData());
				})
				.catch(next);
		})
		.catch(next);
}

function eliminarUsuario(req, res) {
	// únicamente borra a su propio usuario obteniendo el id del token
	Usuario.findOneAndDelete({ _id: req.usuario.id })
		.then((r) => {
			//Buscando y eliminando usuario en MongoDB.
			if (!r) {
				return res.status(404).send('Usuario no encontrado');
			}
			res.status(200).send(`Usuario ${req.params.id} eliminado: ${r}`);
		})
		.catch(next);
}

function iniciarSesion(req, res, next) {
	if (!req.body.email) {
		return res.status(422).json({ errors: { email: 'no puede estar vacío' } });
	}

	if (!req.body.password) {
		return res.status(422).json({ errors: { password: 'no puede estar vacío' } });
	}

	passport.authenticate('local', { session: false }, function(err, user, info) {
		if (err) {
			return next(err);
		}

		if (user) {
			user.token = user.generarJWT();
			return res.json({ user: user.toAuthJSON() });
		} else {
			return res.status(422).json(info);
		}
	})(req, res, next);
}

module.exports = {
	registroUsuario,
	obtenerUsuarios,
	obtenerUsuarioPorId,
	modificarUsuario,
	eliminarUsuario,
	iniciarSesion
};
