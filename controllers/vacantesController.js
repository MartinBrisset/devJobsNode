const Vacante = require('../models/Vacantes');

exports.FormularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante' , {
        nombrePagina: 'Nueva vacante',
        tagline: 'Completa el formulario y publica tu oferta de empleo',
        cerrarSesion: true,
        nombre: req.user.nombre
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
    const vacante = await Vacante.findOne({ url: req.params.url });

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
        nombrePagina: `Editar - ${vacante.titulo}`
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

        res.render('nueva-vacante',{
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
    const { id } = req.params;
    console.log(id);
}