const Vacante = require('../models/Vacantes');

exports.mostrarTrabajos = async (req, res) => {

    const vacantes = await Vacante.find();

    if (!vacantes) {        
        return res.render('home' ,{
            nombrePagina: 'DevJobs',
            tagline: 'Encuentra y publica trabajos para desarrolladores',
            barra: true,
            boton: true
        })
    }
    res.render('home' ,{
        nombrePagina: 'DevJobs',
        tagline: 'Encuentra y publica trabajos para desarrolladores',
        barra: true,
        boton: true,
        vacantes
    })
}

exports.error = (req, res) => {
    res.render('error-mensaje', {
        mensaje: 'Error 404 - No encontrado'
    })
}