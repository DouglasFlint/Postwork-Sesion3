//Critica.js
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Definiendo cada campo con el tipo de dato y validaciones
const CriticaSchema = new mongoose.Schema(
	{
		idUsuario: String,
		idPelicula: {
			type: String,
			required: true
		},
		nombrePelicula: {
			type: String,
			required: true
		},
		comentario: {
			type: String,
			default: ''
		},
		calificacion: {
			type: Number,
			min: 0,
			max: 5,
			required: true
		}
	},
	{
		timestamps: true,
		collection: 'Criticas' //Nombre existente de la colección de películas
	}
);

// usando plugin de validación para que no se repitan correos ni usernames
CriticaSchema.plugin(uniqueValidator, { message: 'Ya existe' });
//Define el modelo Pelicula, utilizando el esquema CriticaSchema.
mongoose.model('Critica', CriticaSchema);
