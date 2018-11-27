'use strict'
const express = require('express');
const router = express.Router(); 
const tipoPolizaCtrl = require('../controllers/tipo_poliza');

const md_auth = require('../middlewares/authenticated'); 
const md_admin = require('../middlewares/is_admin');
const md_employee = require('../middlewares/is_employe');

router.post('/add',[md_auth.ensureAuth, md_admin.isAdmin],tipoPolizaCtrl.add);
router.put('/update/:id',[md_auth.ensureAuth, md_admin.isAdmin], tipoPolizaCtrl.update);
router.get('/get/:id',md_auth.ensureAuth,tipoPolizaCtrl.get);
router.get('/getTodas',md_auth.ensureAuth, tipoPolizaCtrl.getTodos); 
router.delete('/delete/:id',[md_auth.ensureAuth, md_admin.isAdmin], tipoPolizaCtrl.borrar);

module.exports = router;