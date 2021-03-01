/* 
Simulando la respuesta CRUD de objetos Usuario
*/

// importamos la clase de Usuario

const usuario = require('../models/Usuarios')

function crearUsuario(req, res){
    // Inicializamos un nuevo usuario extendiendo desde la clase Usuario
    var usuario = new Usuario(req.body)
    res.status(201).send(usuario)
}

function obtenerUsuarios(req, res){
    //Simulamos que tenemos dos usuarios y los respondemos
    var usuario1 = new Usuario(1, 'Emi', 'Lara', 'Masculino', 'Admin', '23', 'emi_bedu@gmail.com', 'password', '5558435962')
    var usuario2 = new Usuario(2, 'Dan', 'Ruiz', 'Masculino', 'Critico', '25', 'daniellara919@gmail.com', 'password', '5545780734')
    res.send([usuario1, usuario2])
}

function modificarUsuario(req, res){
    // Simulamos que modificamosun usuario ya existente
    var usuario1 = new Usuario(req.params.id, 'Emi', 'Lara', 'Masculino', 'Admin', '23', 'emi_bedu@gmail.com', 'password', '5558435962')
    var modificaciones = req.body
    usuario1 = {...usuario1, ...modificaciones}
    res.send(usuario1)
}

function eliminarUsuario(req,res){
    // simulamos que eliminamos un usuario
    res.status(200).send(`Usuario ${req.params.id} eliminado`);
}

// exportamos las funciones definidas
module.exports = {
    crearUsuario,
    obtenerUsuarios,
    modificarUsuario,
    eliminarUsuario
}



