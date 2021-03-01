/*  Archivo controllers/peliculas.js
 *  Simulando la respuesta de objetos Pelicula
 *  en un futuro aquí se utilizarán los modelos
 */

// importamos el modelo de peliculas
const Pelicula = require('../models/Pelicula');

function crearPelicula(req, res) {
	// Instanciaremos una nueva pelicula usando la informacion del body
	var { nombre, id, duracion, genero, calificación, sinopsis, director, año } = req.body;
	var pelicula = new Pelicula(nombre, id, duracion, genero, calificación, sinopsis, director, año);
	res.status(201).send(pelicula);
}

function obtenerPeliculas(req, res) {
	// Simulación de dos películas
	var peli1 = new Pelicula(
		'Mujer Maravilla 1984',
		1,
		'2h 35m',
		'Fantasía/Aventura',
		'3.5/5',
		'Diana Prince, conocida como Wonder Woman se enfrenta a Cheetah, una villana que posee fuerza y agilidad sobrehumanas.',
		'Patty Jenkins',
		2020
	);
	var peli2 = new Pelicula(
		'Avengers: Endgame',
		2,
		'3h 2m',
		'Acción/Ciencia ficción',
		'4.7/5',
		'Los Vengadores restantes deben encontrar una manera de recuperar a sus aliados para un enfrentamiento épico con Thanos, el malvado que diezmó el planeta y el universo.',
		'Joe Russo, Anthony Russo',
		2019
	);
	res.send([ peli1, peli2 ]);
}

function modificarPelicula(req, res) {
	// simulación de una pelicula previamente existente que el admin modifica
	var peli1 = new Pelicula(
		'Mujer Maravilla 1984',
		1,
		'2h 35m',
		'Fantasía/Aventura',
		'3.5/5',
		'Patty Jenkins',
		'Diana Prince, conocida como Wonder Woman se enfrenta a Cheetah, una villana que posee fuerza y agilidad sobrehumanas.',
		2020
	);
	var modificaciones = req.body;
	res.status(200).send({ ...peli1, ...modificaciones });
}

function eliminarPelicula(req, res) {
	// simulación de la eliminación de una película
	res.status(200).send(`Pelicula con id ${req.params.id} eliminada`);
}

// exportamos las funciones definidas
module.exports = {
	crearPelicula,
	obtenerPeliculas,
	modificarPelicula,
	eliminarPelicula
};
