'use strict'
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

let tipoPolizaSchema = Schema({
    idAgente: {type:Schema.ObjectId, ref:'Empleado', required:[true,'El id del agente es obligatorio']},
    idCompania: { type:Schema.ObjectId , ref:'Compania', required:[true,'El id de la compañia es obligatorio']},
    nombre: { type:String, required:true },
    descripcion:String,
    precioAproximado: { type:Number, required:[true, 'El precio aproximado es obligatorio']},
    status:{ type:String, required:true }
});

module.exports = mongoose.model('TipoPoliza',tipoPolizaSchema);