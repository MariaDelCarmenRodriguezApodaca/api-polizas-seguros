'use strict'
const moment = require('moment');
const bcryp = require('bcrypt-nodejs');
//para manejo de archivos 
var fs = require('fs');
var path = require('path'); //path nos regresa rutas de ficheros en el servidor 
// MODELO
const Empleado = require('../models/empelado');
//SERVICIOS
const jwt = require('../services/jwt');
var cloudinary = require ( 'cloudinary' );


function addEmpleado(req, res) {
    var data = req.body;
    if ( !data.nombre || !data.fechaNacimiento || !data.curp || !data.telefono || !data.usuario || !data.password)
        return res.status(500).send({ message: `Error!!!, no se mandaron todos los datos` });
    var empleado = new Empleado();
    empleado.agente = data.agente || null;
    empleado.nombre = data.nombre;
    empleado.fechaNacimiento = data.fechaNacimiento;
    empleado.curp = data.curp;
    empleado.nss = data.nss || null;
    empleado.telefono = data.telefono;
    empleado.correo = data.correo || null;
    empleado.status = data.status || 'ACTIVO';
    empleado.usuario = data.usuario;
    empleado.role = data.role || 'SECRETARIA';
    bcryp.hash(data.password, null, null, (err, hash) => {
        if (!err) {
            empleado.password = hash; //guardamos la contraseña cifrada
            Empleado.findOne({ curp: empleado.curp }, (err, empleadoEncontrado) => {
                if (err) return res.status(500).send({ message: `Error al validar que el empleado no este registrado ${err}` });
                if (!empleadoEncontrado) {
                    empleado.save((err, empleadoGuardado) => {
                        if (err) return res.status(500).send({ message: `Error al guardar al empleado ${err}` });
                        res.status(200).send({ empleado: empleadoGuardado });
                    });
                } else return res.status(500).send({ message: `Este empleado ya esta registrado`, empleado: empleadoEncontrado });
            });
        } else return res.status(500).send({ message: `Error al cifrar contraseña ${err}` });
    });
}

function login(req, res) {
    var data = req.body;
    console.log(data);
    if (data.usuario && data.password) {
        var usuario = data.usuario.toLowerCase();
        var password = data.password;
        Empleado.findOne({ usuario: usuario }, (err, locatedEmpleado) => {
            if (!err) {
                if (locatedEmpleado) {
                    bcryp.compare(password, locatedEmpleado.password, (err, check) => {
                        if (!err) {
                            if (check) {
                                //comprobar que solicite el token 
                                if (data.getToken) {
                                    //generar y devolver el token 
                                    res.status(200).send({
                                        empleado: locatedEmpleado,
                                        token: jwt.createToken(locatedEmpleado)
                                    })
                                } else return res.status(200).send({ empleado: locatedEmpleado });
                            } else return res.status(500).send({ message: 'La password es incorrecta' });
                        } else return res.status(500).send({ message: `Error al comprobar password ${err}` });
                    }) // fin del compare de bcryp
                } else return res.status(404).send({ message: 'El empleado no existe' });
            } else return res.status(500).send({ message: `Error al localizar usuario ${err}` })
        }) //fin de la busqueda de usuario
    } else return res.status(500).send({ message: 'No se han enviado todos los datos' })
}

function actualizarEmpleado(req, res) {
    var empleadoId = req.params.id;
    var data = req.body;
    //validamos que el id del usuario es el mismo que el de la authorizacion
    if (empleadoId != req.user.sub && req.user.role != "AGENTE") return res.status(500).send({ message: `No tienes permisos para modificar este usuario` });

    Empleado.findByIdAndUpdate(empleadoId, data, { new: true }, (err, userUpdated) => {
        if (err) return res.status(500).send({ message: `Error al actualizar empleado` });
        if (!userUpdated) return res.status(404).send({ message: `No se logro actualizar al empleado` });
        //si no ocurrio error y si se actualizo :
        res.status(200).send({ user: userUpdated });
    });
}

// function subirImagenPerfil(req, res) {
//     var empleadoId = req.params.id;
//     console.log(Object.keys(req.files));

//     if (Object.keys(req.files).length >= 1) {
//         var file_path = req.files.image.path; //image es el nombre del fichero que se envio en este caso se tendra que mandar con el nombre image
//         var file_split = file_path.split('\\'); //separamos para sacar el nombre dle fichero
//         var file_name = file_split[2];
//         var ext_esplit = file_name.split('.');
//         var file_ext = ext_esplit[1];
//         if (empleadoId != req.user.sub) { //validamos que el empleado tenga permisos de actualizar la imagen de perfil
//             fs.unlink(file_path, (err) => {
//                 //con el metodo unLink eliminamos un archivo, le pasamos como parametro un path y un callback el nos regresa un err en caso de exitirlo
//                 if (err) return res.status(500).send({ message: `No tienes permiso para editar y fichero NO eliminado` });
//             });
//             return res.status(500).send({ message: `No tienes permiso para editar este usuario` });
//         }
//         //validamos que sea una imagen 
//         if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'fig') {
//             //validacion del usuario
//             Empleado.findByIdAndUpdate(empleadoId, { urlImagenPerfil: file_name }, { new: true }, (err, empleadoActualizado) => {
//                 if (err) return res.status(500).send({ message: `Error al actualizar empleado` });
//                 if (!empleadoActualizado) return res.status(404).send({ message: `No se logro actualizar al empleado` });
//                 //si no ocurrio error y si se actualizo :
//                 res.status(200).send({ empleado: empleadoActualizado });
//             });
//         } else {
//             //si la extencion no es valida eliminamos el archivo con el modulo fs que ya viene con node
//             fs.unlink(file_path, (err) => {
//                 //con el metodo unLink eliminamos un archivo, le pasamos como parametro un path y un callback el nos regresa un err en caso de exitirlo
//                 if (err) return res.status(500).send({ message: `Extencion no valida y fichero NO eliminado` });
//             });
//             return res.status(500).send({ message: `Extencion no valida` });
//         }

//     } else res.status(404).send({ message: `No se a mandado ninguna imagen` });
// }

function subirImagenPerfil(req,res){
    var empleadoId = req.params.id;
	var data = req.params; //idpadre, tipo
	if (req.files) {
		console.log('Llego un archivo al servidor');
		console.log(req.files.image);
		var ruta_temporal = req.files.image.path; //el campo que enviamos se llama image
		cloudinary.v2.uploader.upload(ruta_temporal, (err, result) => {
			if (!err) {
                data = {
                    urlImage: result.url,
                    public_id:result.public_id
                };
                console.log(data);
                Empleado.findOneAndUpdate({_id:empleadoId},data,{new:true},(err,empleado)=>{
                    if(err) return res.status(500).send({message:`Error al buescar el empleado ${err}`});
                    if(!empleado) return res.status(404).send({message:`No existe el empleado con ese id`});
                    return res.status(200).send({empleado})
                });
			} else res.status(500).send({ message: `Error, al subir imagen de perfil a cloudinary: ${err}` })
		});
	} else res.status(500).send({ message: 'Error, no se envio ningun archivo' });
}

function obtenerImagen(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = `./img/empleados/${imageFile}`;
    fs.exists(path_file, (exist) => { //verificamos si existe 
        if (exist) {
            res.sendFile(path.resolve(path_file));
            // res.status(200).send({ image: `localhost:3000/img/empleados/${imageFile}` });
        } else {
            res.status(404).send({ message: `La imagen no existe` });
        }
    });
}

function getSecretarias(req, res) {
    let agente = req.user.sub;
    Empleado.find({ role: 'SECRETARIA', agente:agente }).exec((err, secretarias) => {
        if (err) return res.status(500).send({ message: `Error en la peticion: ${err}` });
        if (!secretarias) return res.status(404).send({ message: `No hay cuidadores` });
        res.status(200).send({ secretarias });
    })
}



module.exports = {
    addEmpleado,
    login,
    actualizarEmpleado,
    subirImagenPerfil,
    obtenerImagen,
    getSecretarias
}
