const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController')

module.exports = () => {
    router.get('/', homeController.mostrarTrabajos);

    //crear vacantes
    router.get('/vacantes/nueva' , vacantesController.FormularioNuevaVacante);
    router.post('/vacantes/nueva' , vacantesController.agregarVacate);

    //Mostrar vacante
    router.get('/vacantes/:url' , vacantesController.mostrarVacante);

    //editar una vacante
    router.get('/vacantes/editar/:url' , vacantesController.formEditarVacante);
    router.post('/vacantes/editar/:url', vacantesController.editarVacante);

    //crear cuentas
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.validarRegistro, usuariosController.crearUsuario);

    //Autotenticar usuarios
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuarios);

    //panel de administracion
    router.get('/administracion', authController.mostrarPanel)

    return router;
}