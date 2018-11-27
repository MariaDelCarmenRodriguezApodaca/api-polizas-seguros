'use strict'
var app = require('./app');
var config  = require('./config');
const mongoose = require('mongoose');


mongoose.connect(config.hostbd,{ useNewUrlParser: true })
    .then(db=>{ 
        app.listen(config.PORT,()=>{
            console.log(`El servidor esta corriendo en http://localhost:${config.PORT}`);
        });        
    })
    .catch(err=>{
        throw err;
    })

