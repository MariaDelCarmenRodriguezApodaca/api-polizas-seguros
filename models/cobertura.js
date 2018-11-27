'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let coberturaSchema = Schema({
    idCompania:{ type:Schema.ObjectId, ref:'Compania' },
    idTipoPoliza: {  type:Schema.ObjectId , ref:'TipoPoliza' },
    nombre: { type:String, required:[true,'El nombre es obligatorio'] },
    precioAproximado: { type:Number, required:[true, 'El precio aproximado es obligatorio']},
    descripcion: { type:String, required:true},
    status: { type:String, required:true }
});

module.exports = mongoose.model('Cobertura',coberturaSchema);