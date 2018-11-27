'use strict'

const jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../config');
const secret = config.jwtSecretPassword;

exports.ensureAuth = (req,res,next)=>{
    if(req.headers.authorization){
        var token = req.headers.authorization.replace("\"", '');
        try{
            var payload = jwt.decode(token, secret);
            if(payload.exp <= moment.unix()) return res.status(401).send({message:'El token ha expirado'});
        }catch(ex){
            console.error(token);
            return res.status(404).send({message:`El token no es valido`});
        }
        req.user = payload;
        next();
    }else return res.status(403).send({message: 'La peticion no tiene cabecera de auth'});
}


exports.isAdmin = (req,res,next)=>{
    if(req.headers.authorization){
        var token = req.headers.authorization.replace("\"", '');
        try{
            var payload = jwt.decode(token, secret);
            if(payload.exp <= moment.unix()) return res.status(401).send({message:'El token ha expirado'});
            if(payload.role != 'SECRETARIA' || payload.role !="AGENTE") return res.status(500).send({message:`Usted no tiene permiso para agrefar cliente`});
            
        }catch(ex){
            console.error(token);
            return res.status(404).send({message:`El token no es valido`});
        }
        req.user = payload;
        next();
    }else return res.status(403).send({message: 'La peticion no tiene cabecera de auth'});
}