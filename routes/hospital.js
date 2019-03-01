var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var mdAutentificacion = require('../middlewares/autenticacion');

var app = express();

var Hospital = require("../models/hospital");

// ==========================================================
// Obtener todos los hospitales
// ==========================================================
app.get("/", (req, res, next) => {
  Hospital.find({}, "nombre img usuario").exec(
    (err, hospitales) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando Hospitales",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        hospitales: hospitales
      });
    }
  );
});

// ==========================================================
// Actualizar hospital
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Hospital.findById(id, (err, hospital) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un hospital",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: "El hospital con el id " + id + " no existe",
        errors: { message: "No existe un hospital con ese ID" }
      });
    }

    var body = req.body;

    hospital.nombre = body.nombre;

    // Actualizamos al hospital
    hospital.save((err, hospitalGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el hospital",
          errors: err
        });
      }
      // Ocultamos el Password
      hospital.password = ":S";

      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado
      });
    });
  });
});

// ==========================================================
// Crear un nuevo hospital
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var hospital = new Hospital({
    nombre: body.nombre,
    img: body.img
  });

  hospital.save((err, hospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando el Hospital",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado,
      hospitaltoken: req.hospital
    });
  });
});

// ==========================================================
// Eliminar un hospital por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Hospital.findByIdAndDelete(id, (err, hospitalBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar hospital",
        errors: err
      });
    }

    if (!hospitalBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe el hospital con ese id para ser borrado",
        errors: { message: "Hospital no encontrado con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      hospital: hospitalBorrado
    });
  });
});

module.exports = app;
