'use strict'
const Compania = require('../models/compania'); 
const moment = require('moment'); 

function add(req,res){
    var data = req.body; 
    var idAgente = req.user.sub || null;
    if(!data.razonSocial || !data.descripcion) return res.status(500).send({messaje:`Error, no se mandaron todos los datos`});
    Compania.findOne({razonSocial:data.razonSocial},(err,companiaLocated)=>{
        if(err) return res.status(500).send({messaje:`Error al validar que no exista la compañia ${err}`});
        if(companiaLocated) return res.status(500).send({messaje:`Error, compañia ya registrada`});
        let compania = new Compania();
        compania.agente = idAgente;
        compania.razonSocial = data.razonSocial;
        compania.descripcion = data.descripcion;
        compania.status = data.status || 'ACTIVO';
        compania.save((err,companiaGuardada)=>{
            if(err) return res.status(500).send({messaje:`Error al guardar la compañia ${err}`});
            if(!companiaGuardada) return res.status(500).send({message:`Error desconocido al guardar la comañia`});
            res.status(200).send({compania:companiaGuardada});
        });
    });
}
function update(req,res){
    var companiaId = req.params.id;
    var data = req.body; 
    Compania.findByIdAndUpdate(companiaId,data,{new:true},(err,companiaUpdated)=>{
        if(err) return res.status(500).send({message:`Error al actualizar compañia ${err}`});
        if(!companiaUpdated) return res.status(404).send({message:`No se logro actualizar la compañia`});
        //si no ocurrio error y si se actualizo :
        res.status(200).send({compania:companiaUpdated});
    });
}
function get(req,res){
    var companiaId = req.params.id; 
    Compania.findById(companiaId,(err,companiaLocated)=>{
        if(err) return res.status(500).send({message:`Error al buscar compañia ${err}`});
        if(!companiaLocated) return res.status(500).send({message:`No hay compañias guardadas aun`});
        res.status(200).send({compania:companiaLocated});
    });
}
function getTodas(req,res){
    var idAgente = req.user.sub || null;
    Compania.find({agente:idAgente},(err,companiasLocated)=>{
        if(err) return res.status(500).send({message:`Error al buscar compañias ${err}`});
        if(!companiasLocated) return res.status(500).send({message:`No hay compañias guardadas aun`});
        res.status(200).send({companias:companiasLocated});
    })
}

module.exports = {
    add,
    update,
    get,
    getTodas
}