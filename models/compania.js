'use strict'
const mongoose = require('mongoose');
const Schmea = mongoose.Schema;

let companiaSchema = Schmea({
    agente:{ type:Schmea.ObjectId, ref:'Empleado' },
    razonSocial: { type:String, required:[true, 'La razon social es obligatoria']},
    descripcion: { type:String, required:[true, 'La descripcion es obligatoria']},
    status: { type:String, required:[true, 'El status es obligatorio']}
});

module.exports = mongoose.model('Compania',companiaSchema);