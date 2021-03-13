// Importamos las bibliotecas necesarias
var express = require('express'),
	bodyParser = require('body-parser'),
	cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
// Objeto global de la app
var app = express();

/*********************** Mongoose Configuration *******************************/

mongoose
	.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('Conectado a MongoDB');
	})
	.catch((err) => {
		return console.error(err);
	});

mongoose.set('debug', true);

// Aquí se importarán los modelos
require('./models/Usuario');
require('./config/passport');
require('./models/Pelicula');
require('./models/Critica');
/*********************** Mongoose Configuration *******************************/

// configuración de middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Agregamos el código de nuestro router (routes/index.js)
app.use('/v1', require('./routes'));

// Manejando los errores 404
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Iniciando el servidor...
var server = app.listen(process.env.PORT || 3000, function() {
	console.log('Escuchando en el puerto ' + server.address().port);
});
