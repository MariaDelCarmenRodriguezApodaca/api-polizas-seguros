'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema

let polizaSchema = Schema({
    agente:{type:Schema.ObjectId, ref:'Empleado'},
    idCliente: { type:Schema.ObjectId, ref:'Cliente' },
    idTipoPoliza: { type:Schema.ObjectId, ref:'TipoPoliza' },
    descripcion:{type:String},
    fechaRegistro: { type:String, maxlength:15, required:true},
    fechaInicio: { type:String, maxlength:15, required:true},
    fechaFin: { type:String, maxlength:15, required:true},
    status: { type:String, required:true },
    urlImagen: String
});

module.exports = mongoose.model('Poliza',polizaSchema);