const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

var empleadoSchema = Schema({
    agente:{ type:Schema.ObjectId, ref:"Empleado"},
    nombre: { type:String, maxlength:55, required:true },
    fechaNacimiento: { type:String, maxlength:10, required:true},
    curp: { type:String, maxlength:18, required:true },
    nss: { type:String, maxlength:18 },
    telefono: { type:String, required:true },
    correo: { type:String },
    status: { type:String, required:true },
    usuario: { type:String, required:true },
    password: { type:String, required:true },
    role:{ type:String, required:true },
    urlImagenPerfil:String
});

module.exports = mongoose.model('Empleado',empleadoSchema);