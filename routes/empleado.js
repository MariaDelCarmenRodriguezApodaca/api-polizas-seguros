'use strict'
const expresss = require('express');
const router = expresss.Router();
const multipart = require('connect-multiparty');
//controlador del empleado
const empleadoCtrl = require('../controllers/empleado');
// middleware de autentificacion
const md_auth = require('../middlewares/authenticated');
const md_admin = require('../middlewares/is_admin');
var md_upload = multipart({uploadDir: './img/empleados'}); //le pasamos la configuracion uploadDir con la ruta donde se guardan los files


router.post('/add', empleadoCtrl.addEmpleado);
router.post('/login', empleadoCtrl.login)
router.put('/actualizarEmpleado/:id',md_auth.ensureAuth, empleadoCtrl.actualizarEmpleado);
router.put('/subirPerfil/:id',[md_auth.ensureAuth,md_upload],empleadoCtrl.subirImagenPerfil);
router.get('/getImage/:imageFile',empleadoCtrl.obtenerImagen);
router.get('/getSecretarias',[md_auth.ensureAuth, md_admin.isAdmin],empleadoCtrl.getSecretarias);

module.exports = router;
