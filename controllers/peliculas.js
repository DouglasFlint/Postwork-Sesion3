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

function createMongoParams(params) {
	const { genero, duracion, duracionMin, duracionMax, estreno, estrenoMin, estrenoMax } = params;
	const filtros = Object.keys(params);

	let rules = {};
	if (filtros.length > 0) {
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
	const { query } = req;
	let mongoQuery = createMongoParams(query);
	let options = {};
	Pelicula.find(mongoQuery, options).then((peliculas) => {
		if (!peliculas.length) {
			return res.status(404).send('Ninguna conincidencia fué encontrada');
		}
		return res.status(200).json(peliculas);
	});
}
// function obtenerPeliculasPorGenero(req, res, next) {
// 	const genero = req.params.genero;
// 	Pelicula.find({ genero: genero })
// 		.then((results) => {
// 			if (!results) {
// 				return res.status(404).send('Ninguna película de este género fue encontrada');
// 			}
// 			return res.status(302).json(results);
// 		})
// 		.catch(next);
// }

function obtenerPeliculaPorID(req, res, next) {
	const id = req.params.id;
	if (!id) {
		res.status(400).send('Parámetro "id" inexistente');
	}
	Pelicula.findOne({ _id: id })
		.then((pelicula) => {
			if (!pelicula) {
				return res.status(404).send('Película no encontrada');
			}
			return res.status(302).json(pelicula);
		})
		.catch(next);
}

function modificarPelicula(req, res, next) {
	const id = req.params.id;
	let update = {};

	const { nombre, duracion, genero, sinopsis, director, estreno, poster, calPromedio } = req.body;

	if (typeof nombre !== 'undefined') update.nombre = nombre;

	if (typeof duracion !== 'undefined') update.duracion = duracion;

	if (typeof genero !== 'undefined') update.genero = genero;

	if (typeof sinopsis !== 'undefined') update.sinopsis = sinopsis;

	if (typeof director !== 'undefined') update.director = director;

	if (typeof estreno !== 'undefined') update.estreno = estreno;

	if (typeof poster !== 'undefined') update.poster = poster;

	if (typeof calPromedio !== 'undefined') update.calPromedio = calPromedio;

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
	modificarPelicula,
	eliminarPelicula
};
