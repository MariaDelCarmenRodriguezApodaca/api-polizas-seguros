'use strict'
const Cobertura = require('../models/cobertura'); 
const moment = require('moment')



function addCobertura(req,res){
    var data = req.body;
    if(!data.nombre || !data.idTipoPoliza || !data.descripcion || !data.precioAproximado || !data.idCompania) return res.status(500).send({message:`Error, no se mandaron todos los datos`}); 
    let cobertura = new Cobertura(); 
    cobertura.nombre = data.nombre; 
    cobertura.descripcion = data.descripcion; 
    cobertura.idCompania = data.idCompania;
    cobertura.precioAproximado = data.precioAproximado;
    cobertura.idTipoPoliza = data.idTipoPoliza;
    cobertura.status = 'A';
    cobertura.save((err,coberturaGuardada)=>{
        if(err) return res.status(500).send({message:`Error al guardar el tipo de cobertura ${err}`});
        if(!coberturaGuardada) return res.status(404).send({message:`Error desconocido al guardar la cobertura`}); 
        res.status(200).send({cobertura:coberturaGuardada});
    });
}

function updateCobertura(req,res){
    var cobertura_id = req.params.id; 
    var update = req.body; 
    Cobertura.findByIdAndUpdate(cobertura_id,update,{new:true},(err,coberturaUpdated)=>{
        if(err) return res.status(500).send({message:`Error al actualizar el tipo de cobertura ${err}`});
        if(!coberturaUpdated) return res.status(404).send({message:`Error desconocido al actualizar la cobertura`}); 
        res.status(200).send({cobertura:coberturaUpdated});
    });
}

function getCoberturas(req,res){
    Cobertura.find((err,coberturas)=>{
        if(err) return res.status(500).send({message:`Error al obtener las coberturas ${err}`}); 
        if(!coberturas) return res.status(404).send({message:`No hay coberturas guardadas`});
        res.status(200).send({coberturas});
    });
}

function getCobertura(req,res){
    let cobertura_id = req.params.id; 
    Cobertura.findById(cobertura_id,(err, cobertura)=>{
        if(err) return res.status(500).send({message:`Error al obtener laa cobertura ${err}`}); 
        if(!cobertura) return res.status(404).send({message:`No existe esa cobertura`});
        res.status(200).send({cobertura});
    })
}


function deleteCobertura(req,res){
    let cobertura_id = req.params.id; 
    Cobertura.findByIdAndDelete(cobertura_id,(err, cobertura)=>{
        if(err) return res.status(500).send({message:`Error al eliminar la cobertura ${err}`}); 
        if(!cobertura) return res.status(404).send({message:`Error deconocido al eliminar la coberturas`});
        res.status(200).send({cobertura});
    })
}

module.exports = { 
    addCobertura,
    updateCobertura,
    getCobertura,
    getCoberturas,
    deleteCobertura
}