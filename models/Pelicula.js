//Pelicula.js
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Definiendo cada campo con el tipo de dato y validaciones

const PeliculaSchema = new mongoose.Schema(
	{
		nombre: {
			type: String,
			required: true
		},
		duracion: {
			type: Number,
			required: true
		},
		genero: {
			type: String,
			required: true
		},
		sinopsis: {
			type: String,
			required: true
		},
		director: {
			type: String,
			required: true
		},
		estreno: {
			type: Number,
			required: true
		},
		poster: {
			type: String,
			required: true
		},
		idCriticas: {
			type: Array,
			default: []
		},
		calPromedio: {
			type: Number,
			default: 0,
			min: 0,
			max: 5
		}
	},
	{
		timestamps: true,
		collection: 'Peliculas' //Nombre existente de la colección de películas
	}
);

PeliculaSchema.statics.conFechaDeEstreno = (fechaMin, fechaMax) => {
	// console.log('Pelicula Schema this context');
	console.log(this);
	if (fechaMin && fechaMax) {
		console.log(this);
		this.and([
			{
				estreno: {
					$gte: fechaMin
				}
			},
			{
				estreno: {
					$lte: fechaMax
				}
			}
		]);
		console.log(this);
		return;
	}
};

// usando plugin de validación para que no se repitan correos ni usernames
PeliculaSchema.plugin(uniqueValidator, { message: 'Ya existe' });
//Define el modelo Pelicula, utilizando el esquema PeliculaSchema.
mongoose.model('Pelicula', PeliculaSchema);

// // Clase que represneta un registro de película que sera modificado por varios usuarios.

// class Pelicula {
// 	constructor(nombre, id, duracion, genero, calificación, sinopsis, director, año) {
// 		this.nombre = nombre; //Nombre de la película
// 		this.id = id; //ID de la película
// 		this.duracion = duracion; //duracion de la película
// 		this.genero = genero; // genero de la película
// 		this.sinopsis = sinopsis; //descripcion de la película
// 		this.director = director; //director de la película
// 		this.estreno = estreno; //año de estreno de la película
// 	}

// 	guardar() {
// 		//función para guardar un registro nuevo en la base de datos
// 	}

// 	obtener() {
// 		//función para obtener un / multiples registros de la base de datos
// 	}

// 	eliminar() {
// 		//función para eliminar un registro
// 	}

// 	modificar() {
// 		//función para modificar propiedades de un registro
// 	}
// }

// //exporta la clase
// module.exports = Pelicula;
