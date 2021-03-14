/* Modulo de autenticacion de usuarios con passport */
const passport = require('passport');                     
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');

// Email y contraseña para iniciar sesion
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    Usuario.findOne({ email: email }).then(function (user) {
    if (!user || !user.validarPassword(password)) {
        return done(null, false, { errors: { 'email o contraseña': 'equivocado(a)' } });
    }
        return done(null, user);
    }).catch(done);
}));