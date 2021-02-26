// Critica.js

/** Clase que representa la critica que será otorgada por el critico */
class Critica {
	constructor(id_critica, id_usuario, nombre_pelicula, reseña, calificacion){
        this.id_critica = id_critica; // id unico de la reseña
        this.id_usuario = id_usuario // id unico del usuario que esta otorgando la critica
        this.nombre_pelicula = nombre_pelicula // nombre de la pelicula a la que se le otorga la critica
		this.reseña = reseña; // reseña de la pelicula
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