'use strict'
var fs = require('fs');
var path = require('path'); //path nos regresa rutas de ficheros en el servidor 
const Anuncio = require('../models/anuncio');


function add(req, res) {
    var data = req.body;
    if (!data.titulo || !data.agente) return res.status(500).send({ message: `No se mandaron todos los datos` });
    let anuncio = new Anuncio;
    anuncio.agente = data.agente;
    anuncio.titulo = data.titulo;
    anuncio.contenido = data.contenido || null;
    anuncio.status = 'A';
    anuncio.save((err, saved) => {
        if (err) return res.status(500).send({ message: `Error al guardar ${err}` });
        if (!saved) return res.status(404).send({ message: `Error desconocido al guardar el anuncio` });
        return res.status(200).send({ anuncio: saved });
    });
}

function update(req, res) {
    let anuncioId = req.params.id;
    let update = req.body;
    Anuncio.findOneAndUpdate({ _id: anuncioId }, update, { new: true }, (err, updated) => {
        if (err) return res.status(500).send({ message: `Error al actualizar ${err}` });
        if (!updated) return res.status(404).send({ message: `Error desconocido al actualizar el anuncio` });
        return res.status(200).send({ anuncio: updated });
    })
}

function addImage(req, res) {
    var anuncioId = req.params.id;
    console.log(Object.keys(req.files));

    if (Object.keys(req.files).length >= 1) {
        var file_path = req.files.image.path; //image es el nombre del fichero que se envio en este caso se tendra que mandar con el nombre image
        var file_split = file_path.split('\\'); //separamos para sacar el nombre dle fichero
        var file_name = file_split[2];
        var ext_esplit = file_name.split('.');
        var file_ext = ext_esplit[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'fig') {
            Anuncio.findByIdAndUpdate(anuncioId, { urlImagen: file_name }, { new: true }, (err, anuncioUpdated) => {
                if (err) return res.status(500).send({ message: `Error al actualizar imagen de anuncio` });
                if (!anuncioUpdated) return res.status(404).send({ message: `No se logro actualizar al anuncio` });
                res.status(200).send({ anuncio: anuncioUpdated });
            });
        } else {
            fs.unlink(file_path, (err) => {
                if (err) return res.status(500).send({ message: `Extencion no valida y fichero NO eliminado` });
            });
            return res.status(500).send({ message: `Extencion no valida` });
        }
    } else res.status(404).send({ message: `No se a mandado ninguna imagen` });
}

function get(req, res) {
    let anuncioId = req.params.id;
    Anuncio.findById(anuncioId, (err, anuncio) => {
        if (err) return res.status(500).send({ message: `Error al buacar  anuncio` });
        if (!anuncio) return res.status(404).send({ message: `No se lencontro el anuncio` });
        res.status(200).send({ anuncio: anuncio });
    })
}

function getTodo(req, res) {
    var idAgente =  req.params.idAgente;

    Anuncio.find({agente:idAgente},(err, anuncios) => {
        if (err) return res.status(500).send({ message: `Error al buacar  anuncio` });
        if (!anuncios) return res.status(404).send({ message: `Aun no hay anuncios guardados` });
        res.status(200).send({ anuncios });
    })
}

function obtenerImagen(req,res){
    var imageFile = req.params.imageFile;
    var path_file = `./img/anuncios/${imageFile}`;
    fs.exists(path_file,(exist)=>{ //verificamos si existe 
            if(exist){
                res.sendFile(path.resolve(path_file));
            }else{
                res.status(404).send({message:`La imagen no existe`});
            }
    });
}


function borrar(req, res) {
    let anuncioId = req.params.id;
    Anuncio.findByIdAndDelete(anuncioId, (err, anuncio) => {
        if (err) return res.status(500).send({ message: `Error al buacar  anuncio` });
        if (!anuncioUpdated) return res.status(404).send({ message: `No se lencontro el anuncio` });
        res.status(200).send({ anuncio });
    })
}

module.exports = {
    add,
    update,
    addImage,
    get,
    getTodo,
    borrar,
    obtenerImagen
}