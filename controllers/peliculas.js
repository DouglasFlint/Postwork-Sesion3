/*  Archivo controllers/peliculas.js*/

const mongoose = require('mongoose');
const { options } = require('../routes');
const Pelicula = mongoose.model('Pelicula');

function crearPelicula(req, res, next) {
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

function crearMongoQuery(params) {
	const { genero, duracion, duracionMin, duracionMax, estreno, estrenoMin, estrenoMax } = params;

	const filtros = [ genero, duracion, duracionMin, duracionMax, estreno, estrenoMin, estrenoMax ].filter(
		(filtro) => filtro !== undefined
	);
	let rules = {};
	if (filtros.length > 1) {
		rules = {
			$and: []
		};
		if (typeof genero === 'string') {
			// Un genero
			rules['$and'].push({ genero: genero });
		} else if (typeof genero === 'object') {
			// Si genero es un array , regresa una regla OR en válida en MongoDB
			const generos = genero.map((g) => ({ genero: g }));
			rules['$and'].push({ $or: generos });
			console.log(rules['$and']);
			// ${or : [ {genero : "genero1"}, {genero: "genero2"}, ...{genero:"generoN"}]}
		}

		if (duracion) {
			rules['$and'].push({ duracion: duracion });
		} else {
			if (duracionMin && duracionMax) {
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

		if (estreno) {
			rules['$and'].push({ estreno: estreno });
		} else {
			if (estrenoMin && estrenoMax) {
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
	let update = {};

	const { nombre, duracion, genero, sinopsis, director, estreno, poster, estrellas } = req.body;

	if (typeof nombre !== 'undefined') update.nombre = nombre;

	if (typeof duracion !== 'undefined') update.duracion = duracion;

	if (typeof genero !== 'undefined') update.genero = genero;

	if (typeof sinopsis !== 'undefined') update.sinopsis = sinopsis;

	if (typeof director !== 'undefined') update.director = director;

	if (typeof estreno !== 'undefined') update.estreno = estreno;

	if (typeof poster !== 'undefined') update.poster = poster;

	if (typeof estrellas !== 'undefined') update.estrellas = estrellas;

	Pelicula.findByIdAndUpdate(id, update)
		.then(() => {
			return res.status(200).send({ estado: 'Película modificada exitosamente' });
		})
		.catch(next);
}

function eliminarPelicula(req, res, next) {
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
module.exports = {
	crearPelicula,
	obtenerPeliculas,
	obtenerPeliculaPorID,
	obtenerCamposPeliculas,
	modificarPelicula,
	eliminarPelicula
};
