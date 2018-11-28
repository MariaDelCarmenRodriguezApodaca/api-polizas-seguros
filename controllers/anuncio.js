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
                Anuncio.findOneAndUpdate({_id:anuncioId},data,{new:true},(err,anuncio)=>{
                    if(err) return res.status(500).send({message:`Error al buscar el anuncio ${err}`});
                    if(!anuncio) return res.status(404).send({message:`No existe el anuncio con ese id`});
                    return res.status(200).send({anuncio})
                });
			} else res.status(500).send({ message: `Error, al subir imagen de perfil a cloudinary: ${err}` })
		});
	} else res.status(500).send({ message: 'Error, no se envio ningun archivo' });
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