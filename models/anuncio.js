'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let anuncioSchema = Schema({
    agente:{ type:Schema.ObjectId, ref:'Empleado', required:true },
    titulo:{ type:String, maxlength:55, required:[true,'El titulo es obligatorio y puede medir maximo 25 caracteres'] },
    contenido:String,
    status:{ type:String, required:true },
    urlImagen:String
});

module.exports = mongoose.model('Anuncio',anuncioSchema);