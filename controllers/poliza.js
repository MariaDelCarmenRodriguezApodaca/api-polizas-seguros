'use strict'

const Poliza = require('../models/poliza');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const cloudinary =  require('cloudinary')

function add(req, res) {
    var agente;
    if(req.user.role =='AGENTE'){
        agente = req.user.sub;
    }else{
        agente = req.user.agente;
    }
    var data = req.body;
    if (!data.idCliente || !data.idTipoPoliza || !data.fechaInicio || !data.fechaFin || !data.descripcion)
        return res.status(500).send({ message: `No se mandaron todos los datos` });
    let poliza = new Poliza;
    poliza.agente = agente;
    poliza.idCliente = data.idCliente;
    poliza.idTipoPoliza = data.idTipoPoliza;
    poliza.fechaRegistro = moment().format('YYYY-MM-DD');
    poliza.fechaInicio = data.fechaInicio;
    poliza.fechaFin = data.fechaFin;
    poliza.descripcion = data.descripcion;
    poliza.status = 'A';
    poliza.save((err, polizaSaved) => {
        if (err) return res.status(500).send({ message: `Error al guaradar la poliza ${err}` });
        if (!polizaSaved) return res.status(404).send({ message: `Error desconocido al guardar la poliza` });
        return res.status(200).send({ poliza: polizaSaved });
    });
}

function update(req, res) {
    let polizaId = req.params.id;
    let updated = req.body;
    Poliza.findOneAndUpdate({ _id: polizaId }, updated, { new: true }, (err, polizaUpdated) => {
        if (err) return res.status(500).send({ message: `Error al actualizar la poliza ${err}` });
        if (!polizaUpdated) return res.status(404).send({ message: `Error desconocido al actualizar la poliza` });
        return res.status(200).send({ poliza: polizaUpdated });
    });
}

function borrar(req, res) {
    let idPoliza = req.params.id;
    Poliza.findByIdAndDelete(idPoliza, (err, deleted) => {
        if (err) return res.status(500).send({ message: `Error al eliminar la poliza ${err}` });
        if (!deleted) return res.status(404).send({ message: `Error desconocido al eliminar la poliza` });
        return res.status(200).send({ poliza: deleted });
    });
}

function get(req, res) {
    let idPoliza = req.params.id;
    Poliza.findById(idPoliza)
        .populate('idCliente')
        .populate({ path: 'idTipoPoliza', populate: { path: 'idCompania' }, populate: { path: 'idCobertura' } })
        .exec((err, polizas) => {
            if (err) return res.status(500).send({ message: `Error al obtener las polizas ${err}` });
            if (!polizas) return res.status(404).send({ message: `No hay ninguna poliza con ese id` });
            return res.status(200).send({ polizas });
        });
}

function getTodas(req, res) {
    var agente;
    if(req.user.role =='AGENTE'){
        agente = req.user.sub;
    }else{
        agente = req.user.agente;
    }
    Poliza.find({agente:agente})
        .populate('idCliente')
        .populate({ path: 'idTipoPoliza', populate: { path: 'idCompania' }, populate: { path: 'idCobertura' } })
        .exec((err, polizas) => {
            if (err) return res.status(500).send({ message: `Error al obtener las polizas ${err}` });
            if (!polizas) return res.status(404).send({ message: `No hay ninguna poliza` });
            return res.status(200).send({ polizas });
        });
}

function getXCliente(req,res){
    let cliente = req.params.id;
    Poliza.find({idCliente:cliente})
        .populate('idCliente')
        .populate({ path: 'idTipoPoliza', populate: { path: 'idCompania' }, populate: { path: 'idCobertura' } })
        .exec((err, polizas) => {
            if (err) return res.status(500).send({ message: `Error al obtener las polizas ${err}` });
            if (!polizas) return res.status(404).send({ message: `No hay ninguna poliza` });
            return res.status(200).send({ polizas });
        });
}


// function subirImagenPoliza(req, res) {
//     var polizaId = req.params.id;
//     // console.log(Object.keys(req.files['pdf']));
//     // return null;
//     if (Object.keys(req.files).length >= 1) {
//         var file_path = req.files.pdf.path; //image es el nombre del fichero que se envio en este caso se tendra que mandar con el nombre image
//         var file_split = file_path.split('\\'); //separamos para sacar el nombre dle fichero
//         var file_name = file_split[2];
//         var ext_esplit = file_name.split('.');
//         var file_ext = ext_esplit[1];

//         //validamos que sea una imagen 
//         if (file_ext == 'pdf') {
//             //validacion del usuario
//             Poliza.findByIdAndUpdate(polizaId, { urlImagen: file_name }, { new: true }, (err, polizaActualizada) => {
//                 if (err) return res.status(500).send({ message: `Error al actualizar empleado` });
//                 if (!polizaActualizada) return res.status(404).send({ message: `No se logro actualizar la poliza` });
//                 //si no ocurrio error y si se actualizo :
//                 return res.status(200).send({ poliza: polizaActualizada });
//             });
//         } else {
//             //si la extencion no es valida eliminamos el archivo con el modulo fs que ya viene con node
//             fs.unlink(file_path, (err) => {
//                 //con el metodo unLink eliminamos un archivo, le pasamos como parametro un path y un callback el nos regresa un err en caso de exitirlo
//                 if (err) return res.status(500).send({ message: `Extencion no valida y fichero NO eliminado` });
//             });
//             return res.status(500).send({ message: `Extencion no valida` });
//         }

//     } else return res.status(404).send({ message: `No se a mandado ninguna imagen` });
// }

function subirImagenPoliza(req,res){
    var idPolza = req.params.id;
	var data = req.params; //idpadre, tipo
	if (req.files) {
		console.log('Llego un archivo al servidor');
		console.log(req.files.pdf);
		var ruta_temporal = req.files.pdf.path; //el campo que enviamos se llama image
		cloudinary.v2.uploader.upload(ruta_temporal, (err, result) => {
			if (!err) {
                data = {
                    urlPdf: result.url,
                    public_id:result.public_id
                };
                console.log(data);
                Poliza.findOneAndUpdate({_id:idPolza},data,{new:true},(err,poliza)=>{
                    if(err) return res.status(500).send({message:`Error al buescar poliza ${err}`});
                    if(!poliza) return res.status(404).send({message:`No existe la poliza con ese id`});
                    return res.status(200).send({poliza})
                });
			} else res.status(500).send({ message: `Error, al subir pdf de poliza  a cloudinary: ${err}` })
		});
	} else res.status(500).send({ message: 'Error, no se envio ningun archivo' });
}


function obtenerImagen(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = `./img/polizas/${imageFile}`;
    fs.exists(path_file, (exist) => { //verificamos si existe 
        if (exist) {
            res.sendFile(path.resolve(path_file));
            // res.status(200).send({ image: `localhost:3000/img/empleados/${imageFile}` });
        } else {
            res.status(404).send({ message: `La imagen no existe` });
        }
    });
}

module.exports = {
    add,
    update,
    borrar,
    get,
    getTodas,
    getXCliente,
    subirImagenPoliza,
    obtenerImagen
}