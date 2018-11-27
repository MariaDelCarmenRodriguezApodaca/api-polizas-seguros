'use strict'

const express = require('express'); 
const multipart = require('connect-multiparty');

const router = express.Router();
const polizaCtrl = require('../controllers/poliza'); 
const md_auth = require('../middlewares/authenticated'); 
const md_admin = require('../middlewares/is_admin'); 
const md_employye = require('../middlewares/is_employe'); 
var md_upload = multipart({uploadDir: './img/polizas'});

router.post('/add',[md_auth.ensureAuth, md_employye.isEmpleado], polizaCtrl.add );
router.put('/update/:id',[md_auth.ensureAuth, md_employye.isEmpleado], polizaCtrl.update); 
router.get('/get/:id',[md_auth.ensureAuth], polizaCtrl.get);
router.get('/getCliente/:id', polizaCtrl.getXCliente);
router.get('/getTodas',[md_auth.ensureAuth], polizaCtrl.getTodas);
router.delete('/delete/:id',[md_auth.ensureAuth, md_admin.isAdmin], polizaCtrl.borrar); 
router.put('/uploadImage/:id',[md_auth.ensureAuth, md_upload], polizaCtrl.subirImagenPoliza);
router.get('/getImage/:imageFile', polizaCtrl.obtenerImagen);

module.exports = router