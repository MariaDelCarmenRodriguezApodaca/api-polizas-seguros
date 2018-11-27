'use strict'
const express = require('express');
const router= express.Router(); 
const pendienteCtrl = require('../controllers/pendiente'); 

//middlewares
const md_auth = require('../middlewares/authenticated');
const md_admin = require('../middlewares/is_admin');
const md_employe = require('../middlewares/is_employe');

router.post('/add',[md_auth.ensureAuth, md_admin.isAdmin],pendienteCtrl.add);
router.put('/update/:id',[md_auth.ensureAuth, md_admin.isAdmin], pendienteCtrl.update);
router.get('/get/:id',[md_auth.ensureAuth, md_employe.isEmpleado],pendienteCtrl.get);
router.get('/getPendientes',[md_auth.ensureAuth, md_employe.isEmpleado], pendienteCtrl.getPendientes);
router.get('/getTerminados',[md_auth.ensureAuth, md_employe.isEmpleado], pendienteCtrl.getTerminados);
router.get('/getTodos',[md_auth.ensureAuth, md_employe.isEmpleado],pendienteCtrl.getTodos);


module.exports = router;