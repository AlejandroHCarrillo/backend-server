var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

SEED = require("../config/config").SEED;

var app = express();

var Usuario = require("../models/usuario");

app.post("/", (req, res) => {
  var body = req.body;

  Usuario.findOne( { email: body.email }, (err, usuarioDB)=>{
    // validar si ocurrio un error
    if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al encontrar un usuario",
          errors: err
        });
      }

      //  Verifica que exista el usuario
      if(!usuarioDB){
        return res.status(500).json({
            ok: false,
            mensaje: "Credenciales incorrectas (Usuario no existe)",
            errors: err
          });
      }

      console.log(usuarioDB);
      
      // Verificar el password correcto
      if( !bcrypt.compareSync(body.password, usuarioDB.password) ){
        return res.status(200).json({
            ok: false,
            mensaje: "Credenciales incorrectas (Password incorrecto)",
            errors: err
          });
      }

      // Crear token que con 4 horas de vigencia
      usuarioDB.password = ":S";
      var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 } );

    //   regresar respuesta
      res.status(200).json({
          ok: true,
          usuario: usuarioDB,
          token: token,
          id : usuarioDB.id
        }); 
  } )

});

module.exports = app;
