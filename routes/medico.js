var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var mdAutentificacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require("../models/medico");

// ==========================================================
// Obtener todos los medicos
// ==========================================================
app.get("/", (req, res, next) => {
  Medico.find({}, "nombre img usuario hospital").exec(
    (err, medicos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando Medicos",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        medicos: medicos
      });
    }
  );
});

// ==========================================================
// Actualizar medico
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Medico.findById(id, (err, medico) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un medico",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!medico) {
      return res.status(400).json({
        ok: false,
        mensaje: "El medico con el id " + id + " no existe",
        errors: { message: "No existe un medico con ese ID" }
      });
    }

    var body = req.body;

    medico.nombre = body.nombre;
    medico.hospital = body.hospital;
    medico.usuario = body.usuario;

    // Actualizamos al medico
    medico.save((err, medicoGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el medico",
          errors: err
        });
      }
      // Ocultamos el Password
      medico.password = ":S";

      res.status(200).json({
        ok: true,
        medico: medicoGuardado
      });
    });
  });
});

// ==========================================================
// Crear un nuevo medico
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var medico = new Medico({
    nombre: body.nombre,
    hospital : body.hospital,
    usuario : body.usuario
  });

  medico.save((err, medicoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando el Medico",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      medico: medicoGuardado,
      medicotoken: req.medico
    });
  });
});

// ==========================================================
// Eliminar un medico por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Medico.findByIdAndDelete(id, (err, medicoBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar medico",
        errors: err
      });
    }

    if (!medicoBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe el medico con ese id para ser borrado",
        errors: { message: "Medico no encontrado con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      medico: medicoBorrado
    });
  });
});

module.exports = app;
