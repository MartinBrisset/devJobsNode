const Usuarios = require('../models/Usuarios');
const multer = require('multer');
const shortId = require('shortid');


exports.subirImagen = (req, res, next) => {
    //si existe archivo ejecuta funcion upload y luego next
    upload(req, res, function(error) {
        if (error) {
            if(error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande, maximo 100kb');
                } else {
                    req.flash('error', error.message);
                }
            } else {
                req.flash('error', error.message);
            }
            //cuando llega aca, tiene el mensaje del error 
            return res.redirect('/editar-perfil');
        } else {
            //si no existen errores al subir el archivo o no hay archivo, next a la sigueinte funcion
            return next();
        }
    });
}

//opiones de multer
const configuracionMulter = {
    limits: {fileSize: 100000},
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname+'../../public/uploads/perfiles');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            const nombreArchivo = `${shortId.generate()}.${extension}`;
            cb(null, nombreArchivo);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            //se ejecuta el callback (cb) segun si cumple la condicion de ser un formato aceptado o no da true o false
            cb(null, true);
        } else {
            cb(new Error('Formato no valido'), false);
        }
    }
}

const upload = multer(configuracionMulter).single('imagen');

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

exports.formEditarPerfil = (req, res) => {
    res.render('editar-perfil', {
        nombrePagina : 'Edita tu perfil',
        usuario: req.user,
        cerrarSesion: true,
        nombre : req.user.nombre,
        imagen : req.user.imagen
    })
}

exports.editarPerfil = async (req, res) => {
    const usuario = await Usuarios.findById(req.user._id);

    if (!usuario) {
        return res.redirect('/iniciar-sesion');
    }

    //reescribir los datos
    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    if (req.body.password) {
        usuario.password = req.body.password
    }
    
    if (req.file) {
        usuario.imagen = req.file.filename;
    }
    
    await usuario.save(); //guarda el usuario con los datos del formulario

    req.flash('correcto', 'Cambios guardados')

    //redirecciona
    res.redirect('/administracion')
}

exports.validarPerfil = (req, res, next) => {
    // sanitizar
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    if(req.body.password){
        req.sanitizeBody('password').escape();
    }
    // validar
    req.checkBody('nombre', 'El nombre no puede ir vacio').notEmpty();
    req.checkBody('email', 'El correo no puede ir vacio').notEmpty();

    const errores = req.validationErrors();

    if(errores) {
        req.flash('error', errores.map(error => error.msg));

        return res.render('editar-perfil', {
            nombrePagina : 'Edita tu perfil',
            usuario: req.user,
            cerrarSesion: true,
            nombre : req.user.nombre,
            imagen : req.user.imagen,
            mensajes : req.flash()
        })
    }
    next(); // todo bien, siguiente middleware!
    
}

