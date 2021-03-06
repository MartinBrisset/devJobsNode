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

    //resetear password
    router.get('/reestablecer-password', authController.formReestablecerPassword)
    router.post('/reestablecer-password', authController.enviarToken)
    router.get('/reestablecer-password/:token', authController.reestablecerPassword)
    router.post('/reestablecer-password/:token', authController.guardarPassword)
    
    //cerrar sesion
    router.get('/cerrar-sesion', authController.verificarUsuario, authController.cerrarSesion)

    //panel de administracion
    router.get('/administracion',authController.verificarUsuario, authController.mostrarPanel)

    //editar perfil de usuario
    router.get('/editar-perfil' ,authController.verificarUsuario, usuariosController.formEditarPerfil)
    router.post('/editar-perfil', authController.verificarUsuario, usuariosController.subirImagen, usuariosController.editarPerfil)

    //recibir mensajes de candidatos
    router.post('/vacantes/:url', vacantesController.subirCV, vacantesController.contactar)

    //muestra los candidatos por vacante
    router.get('/candidatos/:id', authController.verificarUsuario, vacantesController.mostrarCandidatos)

    //buscador
    router.post('/buscador', vacantesController.buscarVacantes)

    return router;
}