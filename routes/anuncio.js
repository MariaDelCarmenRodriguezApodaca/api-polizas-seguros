'use strict'
const expresss = require('express');
const router = expresss.Router();
const multipart = require('connect-multiparty');
//controlador del empleado
const anuncioCrtl = require('../controllers/anuncio');
// middleware de autentificacion
const md_auth = require('../middlewares/authenticated');
const md_admin = require('../middlewares/is_admin');
const md_employe = require('../middlewares/is_employe');
var md_upload = multipart({uploadDir: './img/anuncios'}); //le pasamos la configuracion uploadDir con la ruta donde se guardan los files

router.post('/add',[md_auth.ensureAuth, md_employe.isEmpleado], anuncioCrtl.add);
router.put('/update/:id', [md_auth.ensureAuth, md_employe.isEmpleado], anuncioCrtl.update);
router.put('/addImage/:id',[md_auth.ensureAuth, md_employe.isEmpleado, md_upload], anuncioCrtl.addImage);
router.get('/getImage/:imageFile',anuncioCrtl.obtenerImagen);
router.get('/get/:id',md_auth.ensureAuth, anuncioCrtl.get);
router.get('/getTodos/:idAgente',md_auth.ensureAuth, anuncioCrtl.getTodo);
router.delete('/delete',[md_auth.ensureAuth, md_employe.isEmpleado],anuncioCrtl.borrar);

module.exports = router;
