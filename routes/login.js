var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

SEED = require("../config/config").SEED;
TIMETOEXPIRE = require("../config/config").TIMETOEXPIRE;

var app = express();

var Usuario = require("../models/usuario");

//  Google
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
CLIENT_ID = require("../config/config").CLIENT_ID

//  ==========================================================
//  Autentificacion Google
//  npm install google-auth-library --save
//  ==========================================================
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
  console.log(payload);

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true


  }
}

app.post("/google", async (req, res) => {

  var token = req.body.token;
  var googleUser = await verify(token)
                          .catch(err =>{
                            return res.status(500).json({
                              ok: false,
                              mensaje: "Token no valido"
                            });
                          });

  return res.status(200).json({
    ok: true,
    mensaje: "Autentificacion google jala",
    googleUser: googleUser
  });
});

//  ==========================================================
//  Autentificacion estandar
//  ==========================================================
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
      var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: TIMETOEXPIRE } );

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
