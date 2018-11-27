'use strict'

const TipoPoliza= require('../models/tipo_poliza');
const moment = require('moment');

function add(req,res){
    var data = req.body;
    if(!data.idCompania  || !data.nombre || !data.precioAproximado ) return res.status(500).send({message:`No se mandaron todos los datos`});
    let tipoPoliza = new TipoPoliza(); 
    tipoPoliza.idCompania = data.idCompania;
    tipoPoliza.nombre = data.nombre;
    tipoPoliza.descripcion = data.descripcion || null;
    tipoPoliza.precioAproximado = parseInt(data.precioAproximado);
    tipoPoliza.status = 'ACTIVO';
    tipoPoliza.save((err,tipoPolizaSaved)=>{
        if(err) return res.status(500).send({message:`Error al guardar el tipo de poliza ${err}`});
        if(!tipoPolizaSaved) return res.status(404).send({message:`Error desconocido al guardar el tipo de poliza`});
        return res.status(200).send({tipoPoliza:tipoPolizaSaved});
    });
}

function update(req,res){
    var idTipoPoliza = req.params.id;
    var update = req.body; 
    TipoPoliza.findOne
    TipoPoliza.findOneAndUpdate,({_id:idTipoPoliza},update,{new:true},(err,tipoPolizaUpdated)=>{
        if(err) return res.status(500).send({message:`Error al actualizar el tipo de poliza ${err}`});
        if(!tipoPolizaUpdated) return res.status(404).send({message:`Error desconocido al actualizar el tipo de poliza`});
        return res.status(200).send({tipoPoliza:tipoPolizaUpdated});
    });
}

function get(req,res){
    var idTipoPoliza = req.params.id;
    TipoPoliza.findById(idTipoPoliza).populate('idCompania').populate('idCobertura').exec((err, tipo_poliza)=>{
        if(err) return res.status(500).send({message:`Error al obtener el tipo poliza ${err}`}); 
        if(!tipo_poliza) return res.status(404).send({message:`No existe ese tipo poliza`});
        res.status(200).send({tipoPoliza});
    })
}

function getTodos(req,res){
    TipoPoliza.find().populate('idCompania').populate('idCobertura').exec((err,tiposPolizas)=>{
        if(err) return res.status(500).send({message:`Error al obtener las coberturas ${err}`}); 
        if(!tiposPolizas) return res.status(404).send({message:`No hay coberturas guardadas`});
        res.status(200).send({tiposPolizas});
    });
}

function borrar(req,res){
    var idTipoPoliza = req.params.id;
    TipoPoliza.findByIdAndDelete(idTipoPoliza,(err, tipo_poliza)=>{
        if(err) return res.status(500).send({message:`Error al eliminar el tipo poliza ${err}`}); 
        if(!tipo_poliza) return res.status(404).send({message:`No existe ese tipo poliza`});
        res.status(200).send({tipo_poliza});
    })
}


module.exports = {
    add,
    update,
    get,
    getTodos,
    borrar
}