exports.isAdmin = (req,res,next)=>{
    if(req.user.role != "AGENTE") return res.status(500).send({message:`No tienes permiso de acceder aqui`});
    next();
}