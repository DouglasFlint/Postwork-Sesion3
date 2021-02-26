// Usuario.js

// Clase que representa al "súper usuario" y sus descendencias

class Usuario{
    constructor(id, nombre, apellido, genero, tipo_usuario, edad){
        this.id = id; // ID
        this.nombre = nombre; // Nombre del cliente
        this.apellido = apellido; //Apellido cliente
        this.genero = genero; // Genero del cliente
        this.tipo_usuario = tipo_usuario; // Tipo Usuario del cliente
        this.edad = edad; // Edad del cliente    \

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