const passport = require('passport')
const Vacante = require('../models/Vacantes');

exports.autenticarUsuarios = passport.authenticate('local', {
    successRedirect : '/administracion',
    failureRedirect : '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Los dos campos son obligatorios'
});

//ver si el usuario esta autenticado

exports.verificarUsuario = (req, res, next) => { //esto es un middleware
    //revisar el usuarios
    if(req.isAuthenticated()){ //es un metodo que ya trae passport
        return next();
    }

    // redireccionar en caso que no este verificado
    res.redirect('/iniciar-sesion');
}

exports.mostrarPanel = async (req, res) => {

    //solicita las vacante para el usuario que esta autenticado en ese momento
    const vacantes = await Vacante.find({autor: req.user._id});

    res.render('administracion', {
        nombrePagina: 'Panel de administracion',
        tagline: 'Crea y administra tus vacantes',
        cerrarSesion: true,
        nombre: req.user.nombre,
        vacantes
    })
}

exports.cerrarSesion = (req, res) => {
    req.logout(); //metodo que trae passport para cerrar la sesion
    req.flash('correcto', 'Cerraste sesion correctamente')

    return res.redirect('/iniciar-sesion')
}