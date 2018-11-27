'use strict'
const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config');

var secret = config.jwtSecretPassword;

exports.createToken = (usuario)=>{
    var payload ={
        sub:usuario._id,
        agente:usuario.agente || null,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        role: usuario.role,
        urlImagenPerfil: usuario.urlImagenPerfil,
        iat: moment().unix(), //fecha de creacion
        exp:moment().add(30,'days').unix() //fecha de expriracion
    }
    //returnamos el token generado:
    //para genereralo pasamos el payload y la clave secreta
    return jwt.encode(payload,secret);
}

