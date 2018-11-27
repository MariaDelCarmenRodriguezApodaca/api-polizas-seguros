'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let pendienteSchema = Schema({
    agente:{ type:Schema.ObjectId, ref:'Empleado', required:true },
    title: { type:String, required:true },
    description: { type:String },
    fechaRegistro: { type:String, required:true},
    start: {type:String, required:true},
    end: { type:String, required:true },
    status: { type:String, required:true },
    importancia: {type:String}
})

module.exports = mongoose.model('Pendiente',pendienteSchema);