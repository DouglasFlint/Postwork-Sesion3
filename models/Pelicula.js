//Pelicula.js

const mongosse = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Definiendo cada campo con el tipo de dato y validaciones

const PeliculaSchema = new mongosse.Schema(
	{
		nombre: {
			type: String,
			required: true
		},
		duracion: {
			type: Number,
			required: true,
			index: true
		},
		genero: {
			type: String,
			required: true,
			index: true
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
			required: true,
			index: true
		},
		calificacionProm: {
			type: Number,
			min: 0,
			max: 5,
			index: true
		}
	},
	{ timestamps: true }
);

// usando plugin de validación para que no se repitan correos ni usernames
PeliculaSchema.plugin(uniqueValidator, { message: 'Ya existe' });
mongoose.model('Pelicula', PeliculaSchema); //Define el modelo Pelicula, utilizando el esquema PeliculaSchema.

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
