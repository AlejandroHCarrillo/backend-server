var portNumber = 3000;
var mongoDBPort = 27017;

// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:' + mongoDBPort + '/hospitalDB', (err, res )=>{
    if (err) throw err;
    
    console.log('Base de datos: \x1b[32m%s\x1b[0m ', ' on line ');    

} );

// Rutas 
// app.get('/', (request, response, next));
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada con exito'
    });
} );

// Escuchar peticiones
app.listen(portNumber, () => { 
    console.log('AHC: El servidor Express esta \x1b[32m%s\x1b[0m ', ' on line corriendo en el puerto ' +portNumber + '.');
} );

// 
