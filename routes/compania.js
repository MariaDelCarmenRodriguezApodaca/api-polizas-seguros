'use strict'
const express = require('express'); 
const router = express.Router();
//controlador
const companiaCtrl = require('../controllers/compania');
//middlewares
const md_auth = require('../middlewares/authenticated');
const md_admin = require('../middlewares/is_admin');
const md_empleado = require('../middlewares/is_employe');

router.post('/add',[md_auth.ensureAuth,md_admin.isAdmin], companiaCtrl.add);
router.put('/update/:id',[md_auth.ensureAuth,md_admin.isAdmin], companiaCtrl.update);
router.get('/get/:id',md_auth.ensureAuth,companiaCtrl.get); 
router.get('/getTodas',md_auth.ensureAuth,companiaCtrl.getTodas); 

module.exports= router;
