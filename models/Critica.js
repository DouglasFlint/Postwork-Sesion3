// Critica.js

/** Clase que representa la critica que será otorgada por el critico */
class Critica {
	constructor(idCritica, idUsuario, idPelicula, nombrePelicula, reseña, calificacion){
        this.idCritica = idCritica; // id unico de la reseña
        this.idUsuario = idUsuario // id unico del usuario que esta otorgando la critica
        this.idPelicula = idPelicula // id unico de la pelicula que se va a hacer una reseña
        this.nombrePelicula = nombrePelicula // nombre de la pelicula a la que se le otorga la critica
		this.comentario = comentario; // reseña de la pelicula
		this.calificacion = calificacion; // calificacion de 0 a 5 sobre la pelicula
    }
    

    agregarCritica() {
        //El usuario agrega una critica a determinada pelicula
    }

    listarCriticas() {
        // El usuario obtiene las peliculas
    }

    modificarCritica() {
        // El usuario modifica los datos de una critica existente
    }

    eliminarCritica() {
        // El usuario elimina una determinada critica
    }

    obtenerPromedio() {
        // El usuario obtiene el promedio de la calificacion de cierta pelicula
    }

}

module.exports = Critica;