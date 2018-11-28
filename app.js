'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const bcryp = require('bcrypt-nodejs');
const jwt = require('./services/jwt');
var cloudinary = require ('cloudinary');

cloudinary.config ({ 
    cloud_name : 'dab2v7vdj' , 
    api_key : '722812522231572' , 
    api_secret : 'TIi3n-WJEWF6qlmmtWFRzu55PMo'  
 });

var app = express();
//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'))

//IMPORTACION RUTAS
let empleadosRoutes = require('./routes/empleado');
let clientesRoutes = require('./routes/cliente');
let companiasRoutes = require('./routes/compania');
let coberturasRoutes = require('./routes/cobertura');
let tiposPolizaRouter = require('./routes/tipo_poliza');
let polizasRoutes = require('./routes/poliza');
let anuncioRoutes = require('./routes/anuncio');
let pendienteRoutes = require('./routes/pendiente');



//configurar cabeceras y cors
app.use((req, res, next) => {
     // Website you wish to allow to connect
     res.setHeader('Access-Control-Allow-Origin', '*');
     // Request methods you wish to allow
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
     // Request headers you wish to allow
     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
     // Set to true if you need the website to include cookies in the requests sent
     // to the API (e.g. in case you use sessions)
     res.setHeader('Access-Control-Allow-Credentials', true);
     // Pass to next layer of middleware
     next();
});



const Cliente = require('./models/cliente');
const Empleado = require('./models/empelado');
//RUTAS
app.post('/login', (req, res) => {
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
                                    return res.status(200).send({
                                        usuario: locatedCliente,
                                        token: jwt.createToken(locatedCliente)
                                    })
                                } else return res.status(200).send({ empleado: locatedCliente });
                            } else return res.status(500).send({ message: 'La password es incorrecta' });
                        } else return res.status(500).send({ message: `Error al comprobar password ${err}` });
                    }) // fin del compare de bcryp
                } else {
                    Empleado.findOne({ usuario: usuario }, (err, locatedEmpleado) => {
                        if (!err) {
                            if (locatedEmpleado) {
                                bcryp.compare(password, locatedEmpleado.password, (err, check) => {
                                    if (!err) {
                                        if (check) {
                                            //comprobar que solicite el token 
                                            if (data.getToken) {
                                                //generar y devolver el token 
                                                return res.status(200).send({
                                                    usuario: locatedEmpleado,
                                                    token: jwt.createToken(locatedEmpleado)
                                                })
                                            } else return res.status(200).send({ empleado: locatedEmpleado });
                                        } else return res.status(500).send({ message: 'La password es incorrecta' });
                                    } else return res.status(500).send({ message: `Error al comprobar password ${err}` });
                                }) // fin del compare de bcryp
                            } else return res.status(404).send({ message: 'El usuario no existe' });
                        } else return res.status(500).send({ message: `Error al localizar usuario ${err}` })
                    }) //fin de la busqueda de usuario
                }
            } else return res.status(500).send({ message: `Error al localizar usuario ${err}` })
        }) //fin de la busqueda de usuario
    } else return res.status(500).send({ message: 'No se han enviado todos los datos' })
});

app.use('/empleado', empleadosRoutes);
app.use('/cliente', clientesRoutes);
app.use('/compania', companiasRoutes);
app.use('/cobertura', coberturasRoutes);
app.use('/tipopoliza', tiposPolizaRouter);
app.use('/poliza', polizasRoutes);
app.use('/anuncio', anuncioRoutes);
app.use('/pendiente', pendienteRoutes);

module.exports = app;



