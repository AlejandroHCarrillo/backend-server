portNumber = require("./config/config").portNumber;
mongoDBPort= require("./config/config").mongoDBPort;

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
var hospitalRoutes = require('./routes/hospital')
var medicoRoutes = require('./routes/medico')
var busquedaRoutes = require('./routes/busqueda')
var uploadRoutes = require('./routes/upload')
var imagenesRoutes = require('./routes/imagenes')

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:' + mongoDBPort + '/hospitalDB', { useNewUrlParser: true }, (err, res )=>{
    if (err) throw err;    
    console.log('Base de datos: \x1b[32m%s\x1b[0m ', ' on line ');    
} );

// Rutas
app.use('/img', imagenesRoutes)
app.use('/upload', uploadRoutes)
app.use('/busqueda', busquedaRoutes)
app.use('/login', loginRoutes)
app.use('/usuario', usuarioRoutes)
app.use('/hospital', hospitalRoutes)
app.use('/medico', medicoRoutes)
app.use('/', appRoutes)

// Escuchar peticiones
app.listen(portNumber, () => { 
    console.log('El servidor express esta \x1b[32m%s\x1b[0m ', ' on line corriendo en el puerto ' +portNumber + '.');
} );

// 
