const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');

module.exports = () => {
    router.get('/', homeController.mostrarTrabajos);

    //crear vacantes
    router.get('/vacantes/nueva' , vacantesController.FormularioNuevaVacante);

    router.post('/vacantes/nueva' , vacantesController.agregarVacate);

    return router;
}