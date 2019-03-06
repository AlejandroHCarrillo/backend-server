var express = require("express");
var app = express();

var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");

app.get("/todo/:busqueda", (req, res, next) => {
  var busqueda = req.params.busqueda;
  var regex = new RegExp(busqueda, "i");

  Promise.all([
    buscarHospitales(busqueda, regex),
    buscarMedicos(busqueda, regex),
    buscarUsuarios(busqueda, regex)
  ]).then(respuestas => {
    res.status(200).json({
      ok: true,
      hospitales: respuestas[0],
      medicos: respuestas[1],
      usuarios: respuestas[2]
    });
  });
});

function buscarHospitales(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ nombre: regex })
    .populate('usuario', 'nombre email')
    .exec((err, hospitales) => {
      if (err) {
        reject("Error al cargar los hospitales", err);
      } else {
        resolve(hospitales);
      }
    });
  });
}

function buscarMedicos(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Medico.find({ nombre: regex })
    .populate('hospital', 'nombre')
    .populate('usuario', 'nombre apellidoP apellidoM email')
    .exec((err, data) => {
      if (err) {
        reject("Error al cargar los Medicos", err);
      } else {
        resolve(data);
      }
    });
  });
}

function buscarUsuarios(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Usuario.find({}, 'nombre apellidoP apellidoM email')
    .or(
      [
        { 'nombre': regex },
        { 'apellidoP': regex },
        { 'apellidoM': regex },
        { 'email': regex }
      ])
      .exec( (err, data) => {
        if (err) {
          reject("Error al cargar los Usuarios", err);
        } else {
          resolve(data);
        }
      }
    );
  });
}

module.exports = app;
