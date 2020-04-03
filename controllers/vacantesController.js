const Vacante = require('../models/Vacantes');

exports.FormularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante' , {
        nombrePagina: 'Nueva vacante',
        tagline: 'Completa el formulario y publica tu oferta de empleo'
    })
}

//agregar vacante a la bd con los datos del formulario
exports.agregarVacate = async (req, res) => {
    const vacante = new Vacante(req.body);

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