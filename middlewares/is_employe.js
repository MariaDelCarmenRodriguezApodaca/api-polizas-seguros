exports.isEmpleado = (req,res,next)=>{
    if(req.user.role != "AGENTE" && req.user.role != "SECRETARIA") return res.status(500).send({message:`No tienes permiso de acceder aqui`});
    next();
}