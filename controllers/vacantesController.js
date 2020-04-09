const Vacante = require('../models/Vacantes');
const multer = require('multer');
const shortId = require('shortid');

exports.FormularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante' , {
        nombrePagina: 'Nueva vacante',
        tagline: 'Completa el formulario y publica tu oferta de empleo',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
    })
}

//agregar vacante a la bd con los datos del formulario
exports.agregarVacate = async (req, res) => {
    const vacante = new Vacante(req.body);

    //usuarios autor de la vacante
    vacante.autor = req.user._id;

    //crear array de los skills
    vacante.skills = req.body.skills.split(','); // convierte a un array los elementos separados con una coma ,

    //guardar en bd
    const nuevaVacante = await vacante.save()

    //redireccionar a la nueva vacante creada
    res.redirect(`/vacantes/${nuevaVacante.url}`);
}

exports.mostrarVacante = async (req, res) => {
    const vacante = await Vacante.findOne({ url: req.params.url }).populate('autor');

    if (!vacante) {        
        return res.render('home' ,{
            nombrePagina: 'DevJobs',
            tagline: 'Encuentra y publica trabajos para desarrolladores',
            barra: true,
            boton: true
        })
    }
    res.render('vacante' , {
        vacante,
        nombrePagina : vacante.titulo,
        barra: true
    })
}

exports.formEditarVacante = async (req, res) => {
    const vacante = await Vacante.findOne({ url: req.params.url });

    if (!vacante) {        
        return res.render('home' ,{
            nombrePagina: 'DevJobs',
            tagline: 'Encuentra y publica trabajos para desarrolladores',
            barra: true,
            boton: true
        })
    }

    res.render('editar-vacante', {
        vacante,
        cerrarSesion: true,
        nombre: req.user.nombre,
        nombrePagina: `Editar - ${vacante.titulo}`,
        imagen: req.user.imagen
    })
}

exports.editarVacante = async (req, res) => {
    vacanteActualizada = req.body;

    vacanteActualizada.skills = req.body.skills.split(','); //pasarlo como un array en el objeto a guardar en bd

    const vacante = await Vacante.findOneAndUpdate({url:req.params.url} , vacanteActualizada, {
        new: true,
        runValidators: true
    });

    if (!vacante) {        
        return res.render('home' ,{
            nombrePagina: 'DevJobs',
            tagline: 'Encuentra y publica trabajos para desarrolladores',
            barra: true,
            boton: true
        })
    }

    res.redirect(`/vacantes/${vacante.url}`);
}

//validar y sanitizar los campos de las nuevas vacantes
exports.validarVacante = (req, res, next) => {
    //sanitizar los campos

    req.sanitizeBody('titulo').escape();
    req.sanitizeBody('empresa').escape();
    req.sanitizeBody('ubicacion').escape();
    req.sanitizeBody('salario').escape();
    req.sanitizeBody('contrato').escape();
    req.sanitizeBody('skills').escape();

    //validar
    req.checkBody('titulo', 'Agrega un titulo a la vacante').notEmpty();
    req.checkBody('empresa', 'Agrega una empresa a la vacante').notEmpty();
    req.checkBody('ubicacion', 'Agrega una ubicacion a la vacante').notEmpty();
    req.checkBody('contrato', 'Agrega un tipo de contrato a la vacante').notEmpty();
    req.checkBody('skills', 'Agrega al menos una habilidad a la vacante').notEmpty();

    const errores = req.validationErrors();

    if(errores){
        //recargar la vista con los errores
        req.flash('error', errores.map(error => error.msg))

        return res.render('nueva-vacante',{
            nombrePagina: 'Nueva vacante',
            tagline: 'Completa el formulario y publica tu oferta de empleo',
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes: req.flash()
        })
    }
    next();
}

exports.eliminarVacante = async (req, res) => {
    //captura el id de la vacante a eliminar
    const { id } = req.params;
    //borra la vacante de la bd
    const vacante = await Vacante.findById(id);

    if (verificarAutor(vacante, req.user)) {
        //todo correcto, este usuario creo la vacante, la puede eliminar
        await vacante.remove();
        //contesta al frontend
        res.status(200).send('Vacante eliminada')
    } else {
        //no podes elimar una vacante que creo otro usuario
        res.status(403).send('Error')
    }

}

const verificarAutor = (vacante = {}, usuario = {}) => {
    if (!vacante.autor.equals(usuario._id)) {
        return false;
    }
    return true;
}

//subir archivos pdf
exports.subirCV = (req, res, next) => {
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
            return res.redirect('back');//vuelve a la pagina anterior
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
            cb(null, __dirname+'../../public/uploads/cv');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            const nombreArchivo = `${shortId.generate()}.${extension}`;
            cb(null, nombreArchivo);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            //se ejecuta el callback (cb) segun si cumple la condicion de ser un formato aceptado o no da true o false
            cb(null, true);
        } else {
            cb(new Error('Formato no valido'), false);
        }
    }
}

const upload = multer(configuracionMulter).single('cv');

//guarda a los posutlados
exports.contactar = async (req, res) => {
    const vacante = await Vacante.findOne({url:req.params.url})
    //si no existe la vacante, es xq el usuario se mamo asi que mandalo pa la cucha
    //deberia tambien de eliinar el archivo pasandole una funcion o algo similar
    if (!vacante) {
        req.flash('error', 'La vacante no existe')
        return res.redirect('back')
    }
    //si esta todo ok, crea el objeto de candidato
    const nuevoCandidato = {
        nombre: req.body.nombre,
        email: req.body.email,
        cv: req.file.filename
    }
    //guarda el candidato en la vacante
    vacante.candidatos.push(nuevoCandidato);
    await vacante.save();

    req.flash('correcto', 'Tu CV fue enviado correctamente')
    res.redirect('/')
}

exports.mostrarCandidatos = async (req, res) => {
    const vacante = await Vacante.findById(req.params.id);

    if (!vacante) {
        req.flash('error', 'Esa vacante no es valida')
        return res.redirect('/administracion')
    }
    //ver solo los candidatos de tus vacantes
    if (vacante.autor != req.user._id.toString()) { //convierte el dato a string y no lo valida estrictamente con ===, porque internamente no son iguales
        req.flash('error', 'Solamente puedes ver los candidatos de las vacantes que seas el autor')
        return res.redirect('/administracion')
    }
    //si quiere ver candidatos de una vancante propia...
    return res.render('candidatos', {
        nombrePagina: `Candidatos Vacante - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        candidatos: vacante.candidatos
    })
}

exports.buscarVacantes = async (req, res) => {
    const vacantes = await Vacante.find({
        $text: {
            $search: req.body.q
        }
    })
    //mostrar las vacantes
    return res.render('home', {
        nombrePagina: `Resultados de la busqueda: ${req.body.q}`,
        barra: true,
        vacantes
    })
}