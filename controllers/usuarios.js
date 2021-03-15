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
		.validate()
		.then((result) => {
			usuario
				.save()
				.then((user) => {
					return res.status(201).json(user.toAuthJSON());
				})
				.catch(next);
		})
		.catch((err) => {
			return res.status(404).send('No se pudo guardar usuario');
		});
}

function createMongoParams(params) {
	// El username y email son unicos y no se toma en cuenta en esta consulta
	const { nombre, apellido, genero, edad, edadMin, edadMax, tipo } = params;
	const filtros = Object.keys(params);

	let rules = {};
	if (filtros.length > 0) {
		rules = {
			$and: []
		};
		//para cuando solo hay un nombre
		if (typeof nombre === 'string') {
			rules['$and'].push({ nombre: nombre });
			//Cuando hay un arreglo de nombres
		} else if (typeof nombre === 'object') {
			const nombres = nombre.map((nom) => ({ nombre: nom }));
			rules['$and'].push({ $or: nombres });
		}

		if (typeof apellido === 'string') {
			rules['$and'].push({ apellido: apellido });
		} else if (typeof apellido === 'object') {
			//Usuarios.find({ '$and': [ { '$or': [ { apellido: 'quintero' }, { apellido: 'vazquez' } ] } )
			const apellidos = apellido.map((ape) => ({ apellido: ape }));
			rules['$and'].push({ $or: apellidos });
		}

		//Solo hay dos opciones, por lo tanto se asigna directamente
		if (genero) {
			rules['$and'].push({ genero: genero });
		}

		if (edad) {
			rules['$and'].push({ edad: edad });
		} else {
			if (edadMin && edadMax) {
				rules['$and'].push({
					$and: [
						{
							edad: {
								$gte: edadMin
							}
						},
						{
							edad: {
								$lte: edadMax
							}
						}
					]
				});
			} else {
				if (edadMin)
					rules['$and'].push({
						edad: {
							$gte: edadMin
						}
					});

				if (edadMax)
					rules['$and'].push({
						edad: {
							$lte: edadMax
						}
					});
			}
		}

		if (typeof tipo === 'number') {
			rules['$and'].push({ tipo: tipo });
		} else if (typeof tipo === 'object') {
			const tipos = tipo.map((tip) => ({ tipo: tip }));
			rules['$and'].push({ $or: tipos });
		}
	} 
	
	else if(Object.keys(rules).length === 0) {
		return {}
	}
	// si no hay filtros entonces se borra la informacion del objeto
	if (rules.$and.length === 0) {
		delete rules.$and;
	}

	return rules;
}

function obtenerUsuarioPorId(req, res, next) {
	Usuario.findById(req.params.id, (err, user) => {
		if (!user || err) {
			res.statusCode = 404;
			res.setHeader('Content-Type', 'text/plain');
			res.end('Error, usuario no encontrado');
			return res;
		}
		return res.status(200).json(user.publicData());
	}).catch(next);
}

function obtenerUsuarios(req, res, next) {
	const { query } = req;
	// funcion que crea un query para filtrar consultas
	let mongoQuery = createMongoParams(query);
	let campo = query.campo;
	let limit = query.limit;
	let projection;
	let documents;
	// arreglo de campos para mostrar en projection del tipo ["username", "nombre"]
	if (campo && typeof campo === 'object') {
		// se convierte el arreglo a cadena
		projection = campo.join(' ');
		// cuando solo se tiene un campo
	} else if (campo && typeof campo === 'string') {
		projection = campo;
	} else {
		projection = '';
	}
	// Se agrega un limite de los campos a mostrar
	if (limit) {
		// Se hace el parseo a int para que pueda emitir la consulta
		documents = parseInt(limit);
	}
	Usuario.find(mongoQuery, projection, (err, users) => {
		if (!users || err || users.length === 0) {
			return res.status(404).send('Ninguna conincidencia fué encontrada');
		}
		var array = [];

		users.forEach(function(user) {
			array.push(user.publicData());
		});

		res.status(200).send(array);
	})
		.limit(documents)
		.catch(next);
}

function modificarUsuario(req, res, next) {
	const id = req.params.id;
	const usuarioAutenticado = res.locals.user;
	//verificar si el id del usuario autenticado coincide con el id del usuario a modificar
	//si el usuario autenticado es admin , puede modificar el usuario
	if (usuarioAutenticado.id === id || usuarioAutenticado.tipo === 0) {
		let modificacion = {};
		const { username, nombre, apellido, genero, edad, email, tipo } = req.body;

		if (typeof username !== 'undefined') modificacion.username = username;

		if (typeof nombre !== 'undefined') modificacion.nombre = nombre;

		if (typeof apellido !== 'undefined') modificacion.apellido = apellido;

		if (typeof genero !== 'undefined') modificacion.genero = genero;

		if (typeof edad !== 'undefined') modificacion.edad = edad;

		if (typeof email !== 'undefined') modificacion.email = email;
		//Verificar que tipo no sea undefinido y el usuario autenticado sea admin
		//usuarios normales no pueden modificar su tipo
		if (typeof tipo !== 'undefined' && usuarioAutenticado.tipo === 0) modificacion.tipo = tipo;

		Usuario.findByIdAndUpdate(id, modificacion, function(err, doc) {
			if (err) return next(err);
			return res.status(200).send({ estado: 'Usuario modificado exitosamente' });
		});
	}
	return res.status(401).send('No tienes permisos para modificar este usuario');
}

function eliminarUsuario(req, res, next) {
	const id = req.params.id;
	const usuarioAutenticado = res.locals.user;
	//verificar si el id del usuario autenticado coincide con el id del usuario a eliminar
	//si el usuario autenticado es admin , puede eliminar cualquier usuario
	if (usuarioAutenticado.id === id || usuarioAutenticado.tipo === 0) {
		Usuario.findByIdAndDelete(id)
			.then((result) => {
				if (!result) {
					return res.status(404).send('Usuario no encontrado');
				}
				console.log();
				res
					.status(200)
					.json({ estado: `Usuario con id ${id} y username ${result.username} eliminado`, usuario: result });
			})
			.catch(next);
	} else {
		return res.status(401).send('No tienes permisos para eliminar este usuario');
	}
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
