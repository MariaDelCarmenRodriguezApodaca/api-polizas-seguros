'use strict'
const express = require('express');
const router= express.Router(); 
const coberturaCtlr = require('../controllers/cobertura'); 

//middlewares
const md_auth = require('../middlewares/authenticated');
const md_admin = require('../middlewares/is_admin');
const md_employe = require('../middlewares/is_employe')

router.post('/add',[md_auth.ensureAuth, md_admin.isAdmin], coberturaCtlr.addCobertura);
router.put('/update/:id',[md_auth.ensureAuth, md_admin.isAdmin], coberturaCtlr.updateCobertura);
router.get('/get',md_auth.ensureAuth, coberturaCtlr.getCoberturas);
router.get('/get/:id',md_auth.ensureAuth, coberturaCtlr.getCobertura);
router.delete('/delete/:id',[md_auth.ensureAuth, md_admin.isAdmin], coberturaCtlr.deleteCobertura); 


module.exports = router


