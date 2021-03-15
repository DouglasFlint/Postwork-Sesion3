/* Archivo controllers/criticas.js*/

// importamos el modelo de criticas
const mongoose = require('mongoose');
const Critica = mongoose.model('Critica');
const Pelicula = mongoose.model('Pelicula');

function crearCritica(req, res, next) {
	// // Instanciaremos una nueva critica utilizando el modelo creado en mongoose
	const { id } = req.usuario;
	var critica = new Critica({
		...req.body,
		idUsuario: id
	});
	critica
		.save()
		.then((critica) => {
			// actualizar la calificación en el registro de la pelicula
			const calificacion = critica.calificacion; //calificacion dada por el usuario a la película
			let peliculaCambios = {
				$inc: {
					//agregar 1 a la cantidad total de usuarios que votaron la cantidad de estrellas dada
					[`estrellas.${calificacion}`]: 1
				},
				$push: {
					//agregar el id de la critica creada en el documento de la película
					idCriticas: critica._id
				}
			};

			Pelicula.updateOne({ _id: critica.idPelicula }, peliculaCambios, (err) => {
				if (err) return next(err);
				return res.status(201).send(critica);
			});
		})
		.catch(next);
}

function obtenerCriticas(req, res, next) {
	const { campo, limit } = req.query;
	const { peliculaID } = req.params;
	//crear projection que es un String que especifica que campos devolver en la consulta
	const projection =
		campo && typeof campo === 'object'
			? // crear un string con los campos definidos en el array campos
				campo.join(' ')
			: //si solo se ha pasado un campo , devolver el valor del campo
				typeof campo === 'string'
				? campo
				: //si ningun campo fue especificado devolver un string vacío
					'';

	const limitNumer = limit ? parseInt(limit) : 0;
	Critica.find()
		.select(projection)
		.limit(limitNumer)
		.where('idPelicula')
		.equals(peliculaID)
		.exec()
		.then((criticas) => {
			res.status(200).send(criticas);
		})
		.catch(next);
}

function modificarCritica(req, res, next) {
	const usuarioAutenticado = res.locals.user;
	const { comentario, calificacion } = req.body;
	const { id } = req.params;
	let modificaciones = { $set: {} };

	if (typeof comentario !== 'undefined') modificaciones.comentario = comentario;
	if (typeof calificacion !== 'undefined') modificaciones.calificacion = calificacion;

	Critica.findById(id, (err, critica) => {
		if (err) return next(err);
		if (!critica) return res.status(404).send('La crítica solicitada no existe');
		//Verificar que la crítica pertenezca al usuario actualmente autenticado
		if (critica.idUsuario === usuarioAutenticado.id) {
			//Actualizar la informacion de la crítica
			Critica.updateOne({ _id: id }, modificaciones, (err) => {
				if (err) return next(err);
				return res.status(200).send({ ...critica._doc, ...modificaciones });
			});

			//Si la calificación cambió, actualizar la calificacion en el documento película
			if (typeof calificacion !== 'undefined' && calificacion !== critica.calificacion) {
				let cambiosPelicula = {
					$inc: {
						//incrementar 1 a la cantidad total de usuarios que votaron la cantidad de estrellas en la nueva modificacion.
						[`estrellas.${calificacion}`]: 1,
						//restar 1 a la cantidad total de usuarios que votaron la catidad de estrellas anterior
						[`estrellas.${critica.calificacion}`]: -1
					}
				};
				Pelicula.updateOne({ _id: critica.idPelicula }, cambiosPelicula, (err, pelicula) => {
					if (err) return next(err);
				});
			}
		} else {
			res.status(401).send('No tienes los permisos para modificar esta crítica');
		}
	});
}

function eliminarCritica(req, res, next) {
	const usuarioAutenticado = res.locals.user;
	const { id } = req.params;

	Critica.findById(id, (err, critica) => {
		if (err) return next(err);
		if (!critica) return res.status(404).send('Crítica no encontrada');
		//Verificar que la crítica pertenezca al usuario actualmente autenticado
		if (critica.idUsuario === usuarioAutenticado.id) {
			//Eliminar critica
			Critica.deleteOne({ _id: id }, (err) => {
				if (err) return next(err);
				return res.status(200).send(`Crítica ${id} eliminada`);
			});
			const modificaciones = {
				//Eliminar el id de la critica del array de criticas en el documento de la película
				$pull: { idCriticas: id },
				//Resta 1 al contador de estrellas de la calificacion de la critica
				$inc: {
					[`estrellas.${critica.calificacion}`]: -1
				}
			};
			Pelicula.updateOne({ _id: critica.idPelicula }, modificaciones, (err) => {
				if (err) return next(err);
			});
		}
	});
}

// exportamos las funciones definidas
module.exports = {
	crearCritica,
	obtenerCriticas,
	modificarCritica,
	eliminarCritica
};
