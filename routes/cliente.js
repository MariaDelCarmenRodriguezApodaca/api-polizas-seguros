'use strict'
const express = require('express'); 
var router = express.Router();
const clienteCtrl = require('../controllers/cliente');

var md_auth = require('../middlewares/authenticated'); //middleware de autentificaion
var md_admin = require('../middlewares/is_admin');
var md_employe = require('../middlewares/is_employe');


router.post('/add', md_auth.ensureAuth , clienteCtrl.addCliente);
router.post('/login', clienteCtrl.login);
router.put('/update/:id', md_auth.ensureAuth, clienteCtrl.updateCliente);
router.get('/getCliente/:id', md_auth.ensureAuth, clienteCtrl.getCliente);
router.get('/getClientes', [md_auth.ensureAuth, md_employe.isEmpleado], clienteCtrl.getClientes);

module.exports = router; 
