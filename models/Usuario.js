// Usuario.js
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');                            
   const jwt = require('jsonwebtoken');                          
   const secret = require('../config').secret;                   

   const UsuarioSchema = new mongoose.Schema({                  
    username: {                                                 
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Campo obligatorio"],
      // regex para no admitir caracteres extraños
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
        lowercase: true,
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
      // regex para formato email
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
      //Nombre existente de la colección de usuarios
      collection: 'Usuarios'
    }
); 

UsuarioSchema.methods.crearPassword = function (password) {
  // generando una contraseña aleatoria dependiendo del usuario
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    // generando una contraseña encriptada hash con salt
    .toString("hex"); 
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
* Devuelve la representación de un usuario, sólo datos públicos por seguridad
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
