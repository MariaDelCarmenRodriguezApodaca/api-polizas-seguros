'use strict'
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

let tipoPolizaSchema = Schema({
    idCompania: { type:Schema.ObjectId , ref:'Compania' },
    nombre: { type:String, required:true },
    descripcion:String,
    precioAproximado: { type:Number, required:[true, 'El precio aproximado es obligatorio']},
    status:{ type:String, required:true }
});

module.exports = mongoose.model('TipoPoliza',tipoPolizaSchema);