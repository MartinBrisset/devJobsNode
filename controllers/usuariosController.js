const Usuarios = require('../models/Usuarios');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina : 'Crea tu cuenta',
        tagline: 'Comienza a publicar tus vacantes'
    })
}

exports.validarRegistro = (req, res, next) => {

    //sanitizar los campos - esto lo hace el express-valitator en la version que tiene el package, sino no funciona
    req.sanitizeBody('nombre').escape(); //escapa los carecteres especiales 
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    req.sanitizeBody('confirmar').escape();

    //validar los datos - esto lo hace el express-valitator en la version que tiene el package, sino no funciona
    req.checkBody('nombre', 'El nombre es Obligatorio').notEmpty();
    req.checkBody('email', 'El email debe ser valido').isEmail(); //mira si es un correo valido
    req.checkBody('password', 'El password es Obligatorio').notEmpty();
    req.checkBody('confirmar', 'El conrifmar password es Obligatorio').notEmpty(); //mira si esta vacia
    req.checkBody('confirmar', 'El password debe ser identido').equals(req.body.password); //compara si son iguales
    

    const errores = req.validationErrors(); //aca captura en un array de objetos si existen errores en las validaciones de arriba (tambien con express-validator)

    if (errores) {
        //si existen errores
        req.flash('error', errores.map(error => error.msg)); //si hay errores, agarra el mensaje y lo guarda en flash
        //vuelve a la vista de crear cuenta y envia los mensajes de error por flash, para que vuelvas a crear tu cuenta sin cometer errores
        res.render('crear-cuenta', {
            nombrePagina : 'Crea tu cuenta',
            tagline: 'Comienza a publicar tus vacantes',
            mensajes: req.flash()
        });
        return;
    }
    //si no hay errores pasa al siguiente middelware
    next();

    return;
}

exports.crearUsuario = async (req, res) => {
    const usuario = new Usuarios(req.body);

    try {
        await usuario.save();
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error)
        res.redirect('/crear-cuenta');
    }

}

exports.formIniciarSesion = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar sesion'
    })
}