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