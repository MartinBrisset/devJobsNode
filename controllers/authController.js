const passport = require('passport');
const Vacante = require('../models/Vacantes');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const enviarEmail = require('../handlers/email')

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
        imagen:req.user.imagen,
        vacantes
    })
}

exports.cerrarSesion = (req, res) => {
    req.logout(); //metodo que trae passport para cerrar la sesion
    req.flash('correcto', 'Cerraste sesion correctamente')

    return res.redirect('/iniciar-sesion')
}

//formulario para reestablecer password
exports.formReestablecerPassword = (req, res) => {
    res.render('reestablecer-password', {
        nombrePagina: 'Reestablece tu password',
        tagline: 'Si ya tienes una cuenta pero olvidaste tu clave, coloca tu email'
    })
}

exports.enviarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({email: req.body.email});

    if (!usuario) {
        req.flash('error', 'Ese correo no esta registrado')
        return res.redirect('/reestablecer-password')
    }
    //el usuario existe, generar el token de recuperacion
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now() + 3600000; //a la hora actual le agrega 1 hora

    //guardar datos en el usuario
    await usuario.save();

    //crear url para mandarla por correo
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;

    //enviar el correo con la info y las intrucciones
    await enviarEmail.enviar({
        usuario,
        subject: 'Resetear Password',
        resetUrl,
        archivo: 'reset'
    })

    req.flash('correcto', 'Revisa tu correo para reestablecer tu password')
    console.log(resetUrl);
    return res.redirect('/iniciar-sesion')
}

exports.reestablecerPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        token: req.params.token,
        expira: {
            $gt : Date.now()
        }
    })

    if (!usuario) {
        req.flash('error', 'El token es invalido, solicita otro')
        return res.redirect('/reestablecer-password')
    }

    return res.render('nuevo-password', {
        nombrePagina: 'Nuevo password'
    })
}

exports.guardarPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        token: req.params.token,
        expira: {
            $gt : Date.now()
        }
    })

    if (!usuario) {
        req.flash('error', 'El token es invalido, solicita otro')
        return res.redirect('/reestablecer-password')
    }

    usuario.password = req.body.password;
    usuario.token = undefined;
    usuario.expira = undefined;

    await usuario.save()

    req.flash('correcto', 'Password actualizada')
    return res.redirect('/iniciar-sesion')
}