const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController')

module.exports = () => {
    router.get('/', homeController.mostrarTrabajos);

    //crear vacantes
    router.get('/vacantes/nueva' ,authController.verificarUsuario, vacantesController.FormularioNuevaVacante);
    router.post('/vacantes/nueva' ,authController.verificarUsuario, vacantesController.validarVacante, vacantesController.agregarVacate);

    //Mostrar vacante
    router.get('/vacantes/:url' , vacantesController.mostrarVacante);

    //editar una vacante
    router.get('/vacantes/editar/:url' ,authController.verificarUsuario, vacantesController.formEditarVacante);
    router.post('/vacantes/editar/:url',authController.verificarUsuario, vacantesController.validarVacante, vacantesController.editarVacante);

    //elimiar vacantes
    router.delete('/vacantes/eliminar/:id', vacantesController.eliminarVacante)

    //crear cuentas
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.validarRegistro, usuariosController.crearUsuario);

    //Autotenticar usuarios
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuarios);
    
    //cerrar sesion
    router.get('/cerrar-sesion', authController.verificarUsuario, authController.cerrarSesion)

    //panel de administracion
    router.get('/administracion',authController.verificarUsuario, authController.mostrarPanel)

    //editar perfil de usuario
    router.get('/editar-perfil' ,authController.verificarUsuario, usuariosController.subirImagen, usuariosController.formEditarPerfil)
    router.post('/editar-perfil', authController.verificarUsuario, usuariosController.validarPerfil, usuariosController.editarPerfil)

    return router;
}