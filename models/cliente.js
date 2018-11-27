'use strict'
const mongoose = require('mongoose'); 
const Schema= mongoose.Schema

var clienteSchema = Schema({
    agente:{ type:Schema.ObjectId, ref:'Empleado', required:true },
    nombre:{ type:String, required:[true, 'El nombre es obligatorio'] },
    fechaNacimiento:{ type:String, required:[true, 'La fecha de nacimiento es obligatoria'] },
    curp:{ type:String, maxLenght:15, required:[true, 'La curp es oligatoria'] },
    telefono:{ type:String, required:true },
    correo:{ type:String, required:true },
    fechaRegistro:{ type:String, required:true },
    usuario: {type:String, required:[true,'El usuario lo usuara para inicar sesión, es necesario registar'] },
    password: { type:String, required:[true,'El usuario lo usuara para inicar sesión, es necesario registar'] },
    urlImagenPerfil:String
})

module.exports = mongoose.model('Cliente',clienteSchema);