// Usuario.js
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');                             //Importando módulo crypto, pendiente de instalar.
   const jwt = require('jsonwebtoken');                          //Importando módulo jsonwebtoken, pendiente de instalar.
   const secret = require('../config').secret;                   

   const UsuarioSchema = new mongoose.Schema({                   //Definiendo el objeto UsuarioSchema con el constructor Schema.
    username: {                                                  //Definiendo cada campo con sus tipo sde datos y validaciones.
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Campo obligatorio"],
      match: [/^[a-zA-Z0-9]+$/, "es inválido"],
      index: true,
    },                                           
    nombre: { 
        type: String, 
        required: true 
    },
    apellido: { 
        type: String, 
        required: true 
    },
    genero: {
        type: String,
        required: true,
        maxLength: 1
    },
    edad: {
        type: Number,
        required: true
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Campo obligatorio"],
      match: [/\S+@\S+\.\S+/, "Email invalido"],
      index: true
    },
    tipo: {
        type: Number,
        min: 0,
        max: 3,
        required: true,
        enum: [0, 1, 2]
    },
    hash: String,
    salt: String,
  },
    {
      timestamps: true,
      collection: 'Usuarios' //Nombre existente de la colección de usuarios
    }
); 

UsuarioSchema.methods.crearPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex"); // generando una "sal" random para cada usuario
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex"); // generando un hash utilizando la sal
};

/**
 * Recibe el password, genera y compara el has con el de la base de datos
 */
UsuarioSchema.methods.validarPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UsuarioSchema.methods.generarJWT = function() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60); // 60 días antes de expirar

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

/**
 * Devuelve la representación de un usuario después de autenticar
 */
UsuarioSchema.methods.toAuthJSON = function(){
  return {
    username: this.username,
    email: this.email,
    token: this.generarJWT(),
    estado: "Usuario registrado exitosamente"
  };
};

/**
* Devuelve la representación de un usuario, sólo datos públicos
*/
UsuarioSchema.methods.publicData = function(){
  return {
    id: this.id,
    username: this.username,
    email: this.email,
    nombre: this.nombre,
    apellido: this.apellido,
    genero: this.genero,
    edad: this.edad,
    tipo: this.tipo,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// usando plugin de validación para que no se repitan correos ni usernames
UsuarioSchema.plugin(uniqueValidator, { message: "Ya existe" });
//Define el modelo Usuario, utilizando el esquema UsuarioSchema
mongoose.model("Usuario", UsuarioSchema); 
