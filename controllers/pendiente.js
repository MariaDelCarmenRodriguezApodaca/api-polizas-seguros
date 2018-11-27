'use strict'

const Pendiente = require('../models/pendiente'); 
const moment = require('moment');


/**STATUS: PENDIENTE, TERMINADO */
function add(req,res){
    let data = req.body;
    var agente;
    if(req.user.role =='AGENTE'){
        agente = req.user.sub;
    }else{
        agente = req.user.agente;
    }
    console.log(data);
    if(!data.title ||  !data.start || !data.end || !data.importancia) return res.status(500).send({message:`No se mandaron todos los datos`});
    let pendiente = new Pendiente;
    pendiente.agente= agente;
    pendiente.title = data.title;
    pendiente.description = data.description || null;
    pendiente.fechaRegistro = moment().format('YYYY-MM-DD');
    pendiente.start = data.start;
    pendiente.end = data.end;
    pendiente.importancia = data.importancia;
    pendiente.status='PENDIENTE';
    pendiente.save((err,pendienteSaved)=>{
        if(err) return res.status(500).send({message:`Error al guardar el pendiente ${err}`});
        if(!pendienteSaved) return res.status(404).send({message:`Error desconocido al guardar el pendiente`});
        console.log('--------------------------------------------');
        console.log(pendienteSaved);
        return res.status(200).send({pendiente:pendienteSaved});
    });
}

function update(req,res){
    let pendienteId = req.params.id; 
    let update = req.body; 
    Pendiente.findOneAndUpdate({_id:pendienteId},update,{new:true},(err,pendienteUpdated)=>{
        if(err) return res.status(500).send({message:`Error al guardar el pendiente`});
        if(!pendienteUpdated) return res.status(404).send({message:`Error desconocido al guardar el pendiente`});
        return res.status(200).send({pendiente:pendienteUpdated});
    })
}

function get(req,res){
    let pendienteId = req.params.id; 
    Pendiente.findById(pendienteId,(err,pendienteLocated)=>{
        if(err) return res.status(500).send({message:`Error al localizar el pendiente`});
        if(!pendienteLocated) return res.status(404).send({message:`No existe pendiente con id ${pendienteId}`});
        return res.status(200).send({pendiente:pendienteLocated});
    })
}

function getPendientes(req,res){ 
    var agente;
    if(req.user.role =='AGENTE'){
        agente = req.user.sub;
    }else{
        agente = req.user.agente;
    }
    Pendiente.find({agente:agente},(err,pendienteLocated)=>{
        if(err) return res.status(500).send({message:`Error al localizar el pendiente`});
        if(!pendienteLocated) return res.status(404).send({message:`No existe pendiente con id ${pendienteId}`});
        return res.status(200).send({pendientes:pendienteLocated});
    })
}

function getTerminados(req,res){ 
    Pendiente.find({status:'TERMINADO'},(err,pendienteLocated)=>{
        if(err) return res.status(500).send({message:`Error al localizar el pendiente`});
        if(!pendienteLocated) return res.status(404).send({message:`No existe pendiente con id ${pendienteId}`});
        return res.status(200).send({pendiente:pendienteLocated});
    })
}

function getTodos(req,res){
    Pendiente.find((err,pendientes)=>{
        if(err) return res.status(500).send({message:`Error al localizar el pendiente`});
        if(!pendientes) return res.status(404).send({message:`No hay oendientes guardados`});
        return res.status(200).send({pendientes});
    })
}

function borrar(req,res){
    let pendienteId = req.params.id; 
    Pendiente.findByIdAndDelete(pendienteId,(err,pendienteDeleted)=>{
        if(err) return res.status(500).send({message:`Error al localizar el pendiente`});
        if(!pendienteDeleted) return res.status(404).send({message:`No existe pendiente con id ${pendienteId}`});
        return res.status(200).send({pendiente:pendienteDeleted});
    })
}


module.exports ={
    add,
    update,
    get,
    getTodos,
    getPendientes,
    getTerminados,
    borrar
}