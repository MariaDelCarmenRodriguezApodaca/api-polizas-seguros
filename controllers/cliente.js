'use strict'
const moment = require('moment');
const bcryp = require('bcrypt-nodejs');

//para manejo de archivos 
var fs = require('fs');
var path = require('path'); //path nos regresa rutas de ficheros en el servidor 
// MODELO
const Cliente = require('../models/cliente');
//SERVICIOS
const jwt = require('../services/jwt');

function addCliente(req, res) {
    var agente;
    if(req.user.role =='AGENTE'){
        agente = req.user.sub;
    }else{
        agente = req.user.agente;
    }
    var data = req.body;
    if (!data.nombre || !data.fechaNacimiento || !data.curp || !data.telefono || !data.correo || !data.usuario || !data.password)
        return res.status(500).send({ message: `No se enviaron todos los datos` });
    var cliente = new Cliente();
    cliente.agente = agente;
    cliente.nombre = data.nombre;
    cliente.fechaNacimiento = data.fechaNacimiento;
    cliente.curp = data.curp;
    cliente.telefono = data.telefono;
    cliente.correo = data.correo;
    cliente.usuario = data.usuario;
    cliente.fechaRegistro = moment().format('YYYY/MM/DD, h:mm:ss');
    bcryp.hash(data.password, null, null, (err, hash) => {
        if (err) return res.status(500).send({ message: `Error al encriptar contraseña` });
        cliente.password = hash;
        Cliente.findOne({ curp: cliente.curp }, (err, clienteEncontrado) => {
            if (err) return res.status(401).send({ message: `Erro al validar duplicidad de clientes` });
            if (clienteEncontrado) return res.status(500).send({ message: `Ya exista un cliente registrado con esa curp` });
            cliente.save((err, clienteGuardado) => {
                if (err) return res.status(500).send({ message: `Error al guardar el cliente ${err}` });
                if (!clienteGuardado) return res.status(404).send({ message: `Error desconocido al guiardar el cliente` });
                return res.status(200).send({ cliente: clienteGuardado });
            });
        });
    });
}

function login(req, res) {
    var data = req.body;
    if (data.usuario && data.password) {
        var usuario = data.usuario.toLowerCase();
        var password = data.password;
        Cliente.findOne({ usuario: usuario }, (err, locatedCliente) => {
            if (!err) {
                if (locatedCliente) {
                    bcryp.compare(password, locatedCliente.password, (err, check) => {
                        if (!err) {
                            if (check) {
                                //comprobar que solicite el token 
                                if (data.getToken) {
                                    //generar y devolver el token 
                                    res.status(200).send({
                                        empleado: locatedCliente,
                                        token: jwt.createToken(locatedCliente)
                                    })
                                } else return res.status(200).send({ empleado: locatedCliente });
                            } else return res.status(500).send({ message: 'La password es incorrecta' });
                        } else return res.status(500).send({ message: `Error al comprobar password ${err}` });
                    }) // fin del compare de bcryp
                } else return res.status(404).send({ message: 'El cliente no existe' });
            } else return res.status(500).send({ message: `Error al localizar usuario ${err}` })
        }) //fin de la busqueda de usuario
    } else return res.status(500).send({ message: 'No se han enviado todos los datos' })
}

function updateCliente(req, res) {
    var clienteId = req.params.id;
    var data = req.body;

    if (clienteId != req.user.sub && req.user.role != "AGENTE" && req.user.role != "SECRETARIA") return res.status(500).send({ message: `Tu no tienes permiso de actualizar este usuario` })

    Cliente.findByIdAndUpdate(clienteId, data, { new: true }, (err, clienteUpdated) => {
        if (err) return res.status(500).send({ message: `Error al actualizar cliente ${err}` });
        if (!clienteUpdated) return res.status(404).send({ message: `No se logro actualizar al cliente` });
        //si no ocurrio error y si se actualizo :
        res.status(200).send({ user: clienteUpdated });
    });

}

function getCliente(req, res) {
    var clienteId = req.params.id;
    Cliente.findById(clienteId).populate({path:'agente'}).exec((err, clienteLocated) => {
        if (err) return res.status(500).send({ message: `Error al localizar al cliente ${err}` });
        if (!clienteLocated) return res.status(404).send({ message: `No se encontro al cliente` });
        res.status(200).send({ cliente: clienteLocated });
    });
}

function getClientes(req, res) {

    var agente;
    if(req.user.role =='AGENTE'){
        agente = req.user.sub;
    }else{
        agente = req.user.agente;
    }
    Cliente.find({agente:agente}).exec((err, clientes) => {
        if (err) return res.status(500).send({ message: `Error al localizar los clientes ${err}` });
        if (!clientes) return res.status(404).send({ message: `No se encontraron clientes` });
        res.status(200).send({ clientes: clientes });
    });
}

module.exports = {
    addCliente,
    updateCliente,
    getCliente,
    getClientes,
    login
}