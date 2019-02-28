var portNumber = 3000;
var mongoDBPort = 27017;

// Requires
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')

// Inicializar variables
var app = express()

// Body Parser
// parse application/x-www-form-urlencoded
// parse application/json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar Rutas 
var appRoutes = require('./routes/app')
var usuarioRoutes = require('./routes/usuario')
var loginRoutes = require('./routes/login')

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:' + mongoDBPort + '/hospitalDB', (err, res )=>{
    if (err) throw err;
    
    console.log('Base de datos: \x1b[32m%s\x1b[0m ', ' on line ');    

} );

// Rutas
app.use('/login', loginRoutes)
app.use('/usuario', usuarioRoutes)
app.use('/', appRoutes)


// Escuchar peticiones
app.listen(portNumber, () => { 
    console.log('AHC: El servidor Express esta \x1b[32m%s\x1b[0m ', ' on line corriendo en el puerto ' +portNumber + '.');
} );

// 
