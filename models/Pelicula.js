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
			type: [ String ],
			default: []
		},
		estrellas: {
			//Cantidad de estrellas y número de personas que asignaron esa cantidad de estrellas
			//1 : 500 => 500 personas le han asignado 1 estrella a esta película
			1: {
				type: Number,
				default: 0
			},
			2: {
				type: Number,
				default: 0
			},
			3: {
				type: Number,
				default: 0
			},
			4: {
				type: Number,
				default: 0
			},
			5: {
				type: Number,
				default: 0
			}
		}
	},
	{
		timestamps: true,
		collection: 'Peliculas' //Nombre existente de la colección de películas
	}
);

// usando plugin de validación para que no se repitan correos ni usernames
PeliculaSchema.plugin(uniqueValidator, { message: 'Ya existe' });
//Define el modelo Pelicula, utilizando el esquema PeliculaSchema.
mongoose.model('Pelicula', PeliculaSchema);
