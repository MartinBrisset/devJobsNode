const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const Usuarios = require('../models/Usuarios');

passport.use(new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password'
}, async (email, password, done) => {
    const usuario = await Usuarios.findOne({ email });

    if (!usuario) {
        return done(null, false, {
            message: 'Usuario no eistente'
        });
    }
    //el usuario existe, verifica la clave
    const verificaPass = usuario.compararPassword(password)
    if (!verificaPass) {
        return done(null, false, {
            message: 'La clave es incorrecta'
        });
    }
    //si el usuario existe y la clave es correcta, entonces..
    return done(null, usuario);
}));

passport.serializeUser((usuario, done) => done(null, usuario._id));

passport.deserializeUser(async (id, done) => {
    const usuario = await Usuarios.findById(id).exec();
    return done(null, usuario)
});

module.exports = passport;