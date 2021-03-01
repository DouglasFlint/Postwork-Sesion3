/*  Archivo controllers/criticas.js
 *  Simulando la respuesta de objetos Critica
 *  en un futuro aquí se utilizarán los modelos
 */

// importamos el modelo de criticas
const Critica = require('../models/Critica')

function crearCritica(req, res) {
  // Instanciaremos una nueva critica utilizando la clase Critica
  var critica = new Critica(req.body)
  res.status(201).send(critica)
}

function obtenerCriticas(req, res) {
  // Simulando dos criticas y respondiendolas
  var critica1 = new Critica(1, 1, 'El ilusionista', 'Buena pelicula', 4)
  var critica2 = new Critica(2, 2, 'El origen', 'No me gusto', 3)
  res.send([critica1, critica2])
}

function modificarCritica(req, res) {
  // simulando uns critica previamente existente que el critico modifica
  var critica1 = new Critica(req.params.id, 1, 'El ilusionista', 'jExcelente pelicula con buenas actuaciones', 5)
  var modificaciones = req.body
  critica1 = { ...critica1, ...modificaciones }
  res.send(critica1)
}

function eliminarCritica(req, res) {
  // se simula una eliminación de critica, regresando un 200
  res.status(200).send(`Critica ${req.params.id} eliminada`);
}

// exportamos las funciones definidas
module.exports = {
    crearCritica,
    obtenerCriticas,
    modificarCritica,
    eliminarCritica
}