/*  Archivo controllers/peliculas.js*/

const mongoose = require('mongoose');
const Pelicula = mongoose.model('Pelicula');

function crearPelicula(req, res, next) {
	const usuarioAutenticado = res.locals.user;
	//Validar que el usuario autenticado sea admin
	if (usuarioAutenticado.tipo === 0) {
		// Instancia de nueva pelicula usando la clase Pelicula
		const body = req.body;

		const pelicula = new Pelicula(body);

		// res.send(pelicula);
		pelicula
			.validate()
			.then((result) => {
				pelicula
					.save()
					.then((register) => {
						return res.status(201).send({ estado: 'Película añadida exitosamente', pelicula: register });
					})
					.catch(next);
			})
			.catch((err) => {
				res.status(400).send(err.message);
			});
	}
	return res.status(401).json({ estado: 'No tienes permisos para realizar esta accion' });
}

function crearMongoQuery(params) {
	const {
		genero,
		duracion,
		duracionMin,
		duracionMax,
		estreno,
		estrenoMin,
		estrenoMax
		// nombre
	} = params;

	//Verificar que los parámetros existentes tengan un valor válido para ser contados
	const filtros = [
		genero,
		duracion,
		duracionMin,
		duracionMax,
		estreno,
		estrenoMin,
		estrenoMax
		// nombre
	].filter((filtro) => filtro !== undefined);
	//objeto que representan las reglas en mongodb
	let rules = {};
	//Si hay mas de un flitro agregar el operador $and al query
	if (filtros.length > 0) {
		rules = {
			$and: []
		};

		// if (typeof nombre === 'string') {
		// 	rules['$and'].push({ nombre: nombre });
		// }

		if (typeof genero === 'string') {
			// Un genero
			rules['$and'].push({ genero: genero });
		} else if (typeof genero === 'object') {
			// Si genero es un array , regresa una regla OR en válida en MongoDB
			const generos = genero.map((g) => ({ genero: g }));
			rules['$and'].push({ $or: generos });
			// ${or : [ {genero : "genero1"}, {genero: "genero2"}, ...{genero:"generoN"}]}
		}

		//Si el parametro duracion existe agregar la regla
		if (duracion) {
			//agregar la regla de igualdad para la propiedad duración
			rules['$and'].push({ duracion: duracion });
		} else {
			//Si el parámetro duracion no existe
			//verificar si los parámetros de duracion min-max existen
			if (duracionMin && duracionMax) {
				//Si los dos existen agregarlos en una regla $and
				rules['$and'].push({
					$and: [
						{
							duracion: {
								$gte: duracionMin
							}
						},
						{
							duracion: {
								$lte: duracionMax
							}
						}
					]
				});
			} else {
				//Si no existen los dos parámetros, agregarlos independientemente
				if (duracionMin)
					rules['$and'].push({
						duracion: {
							$gte: duracionMin
						}
					});

				if (duracionMax)
					rules['$and'].push({
						duracion: {
							$lte: duracionMax
						}
					});
			}
		}
		//Si el parametro estreno existe agregar la regla
		if (estreno) {
			//agregar la regla de igualdad para la propiedad estreno
			rules['$and'].push({ estreno: estreno });
		} else {
			//Si el parámetro estreno no existe
			//verificar si los parámetros de estreno min-max existen
			if (estrenoMin && estrenoMax) {
				//Si los dos existen agregarlos en una regla $and
				rules['$and'].push({
					$and: [
						{
							estreno: {
								$gte: estrenoMin
							}
						},
						{
							estreno: {
								$lte: estrenoMax
							}
						}
					]
				});
			} else {
				//Si no existen los dos parámetros, agregarlos independientemente
				if (estrenoMin)
					rules['$and'].push({
						estreno: {
							$gte: estrenoMin
						}
					});

				if (estrenoMax)
					rules['$and'].push({
						estreno: {
							$lte: estrenoMax
						}
					});
			}
		}
	}
	//regresar el objeto completo con las reglas creadas
	return rules;
}

function obtenerPeliculas(req, res, next) {
	//Obtener todos los parametros
	const { query } = req;
	//Obtener los parametros campo y limit
	const { campo, limit } = query;
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
	const limitNumer = parseInt(limit);
	//Si el límite de resultados es definido por esl usuario agregar el limite en las opciones , caso contrario, redolver un objeti vacio
	const options = limitNumer ? { limit: limitNumer } : {};
	let mongoQuery = crearMongoQuery(query);
	console.log(mongoQuery);
	Pelicula.find(mongoQuery, projection, options)
		.then((peliculas) => {
			if (!peliculas.length) {
				return res.status(404).send('Ninguna conincidencia fué encontrada');
			}
			return res.status(200).json(peliculas);
		})
		.catch(next);
}

function obtenerPeliculaPorID(req, res, next) {
	const id = req.params.id;
	if (!id) res.status(400).send('Parámetro "id" inexistente');

	Pelicula.findOne({ _id: id })
		.then((pelicula) => {
			if (!pelicula) {
				return res.status(404).send('Película no encontrada');
			}
			return res.status(302).json(pelicula);
		})
		.catch(next);
}

function obtenerCamposPeliculas(req, res, next) {
	//Obtener los campos a devolver en el
	const { campo, limit } = req.query;
	//el string projection especifica que campos devolver en la consulta
	const projection =
		campo && typeof campo === 'object'
			? // crear un string con los campos definidos en el array campos
				campo.join(' ')
			: //si solo se ha pasado un campo , devolver el valor del campo
				typeof campo === 'string'
				? campo
				: //si ningun campo fue especificado devolver un string vacío
					'';
	const limitNumer = parseInt(limit);
	//Si el límite de resultados es definido por esl usuario agregar el limite en las opciones , caso contrario, redolver un objeti vacio
	const options = limitNumer ? { limit: limitNumer } : {};
	Pelicula.find({}, projection, options, (err, peliculas) => {
		if (err) next(err);
		return res.send(peliculas);
	});
}

function modificarPelicula(req, res, next) {
	const id = req.params.id;
	const usuarioAutenticado = res.locals.user;
	//Verificar que el usuario autenticado sea admin
	//Usuarios normales no pueden editar la informacion de las peliculas
	if (usuarioAutenticado.tipo !== 0)
		return res.status(401).send({ estado: 'No tienes permisos para realizar esta accion' });

	const { nombre, duracion, genero, sinopsis, director, estreno, poster, estrellas } = req.body;

	if (typeof nombre !== 'undefined') update.nombre = nombre;

	if (typeof duracion !== 'undefined') update.duracion = duracion;

	if (typeof genero !== 'undefined') update.genero = genero;

	if (typeof sinopsis !== 'undefined') update.sinopsis = sinopsis;

	if (typeof director !== 'undefined') update.director = director;

	if (typeof estreno !== 'undefined') update.estreno = estreno;

	if (typeof poster !== 'undefined') update.poster = poster;

	if (typeof estrellas !== 'undefined') {
		update.estrellas = {};
		//Hacer un ciclo del 1 al 5 para verificar que la propiedad que representa el numero de estrellas exista
		//estrellas: {1,2,3,4,5}
		for (let index = 1; index < 6; index++) {
			const numeroDeEstrellas = index.toString();
			if (typeof estrellas[numeroDeEstrellas] !== 'undefined')
				update.estrellas[numeroDeEstrellas] = estrellas[numeroDeEstrellas];
		}
		//Si la propiedad estrellas existe pero sin ningún valor, elimina la propiedad de la actualizacion para evitar borrar la información original de peliculas.estrellas
		if (Object.keys(update.estrellas).length === 0) delete update.estrellas;
	}

	Pelicula.findByIdAndUpdate(id, update)
		.then(() => {
			return res.status(200).send({ estado: 'Película modificada exitosamente' });
		})
		.catch(next);
}

function eliminarPelicula(req, res, next) {
	const usuarioAutenticado = res.locals.user;
	if (usuarioAutenticado.tipo === 0) {
		const id = req.params.id;
		Pelicula.findByIdAndDelete(id)
			.then((result) => {
				if (!result) {
					return res.status(404).send('Película no encontrada');
				}
				res.status(200).json({ estado: `Película ${id} eliminada`, pelicula: result });
			})
			.catch(next);
	}
	return res.status(401).json({ estado: 'No tienes permisos para realizar esta accion' });
}
module.exports = {
	crearPelicula,
	obtenerPeliculas,
	obtenerPeliculaPorID,
	obtenerCamposPeliculas,
	modificarPelicula,
	eliminarPelicula
};
