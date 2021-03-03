//Pelicula.js

// Clase que represneta un registro de película que sera modificado por varios usuarios.

class Pelicula {
	constructor(nombre, id, duracion, genero, calificación, sinopsis, director, año) {
		this.nombre = nombre; //Nombre de la película
		this.id = id; //ID de la película
		this.duracion = duracion; //duracion de la película
		this.genero = genero; // genero de la película
		this.sinopsis = sinopsis; //descripcion de la película
		this.director = director; //director de la película
		this.estreno = estreno; //año de estreno de la película
	}

	guardar() {
		//función para guardar un registro nuevo en la base de datos
	}

	obtener() {
		//función para obtener un / multiples registros de la base de datos
	}

	eliminar() {
		//función para eliminar un registro
	}

	modificar() {
		//función para modificar propiedades de un registro
	}
}

//exporta la clase
module.exports = Pelicula;
