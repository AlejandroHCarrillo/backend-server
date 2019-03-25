var express = require("express");

var fileUpload = require("express-fileupload");
var fs = require("fs");

var app = express();

app.use(fileUpload());

var Usuario = require("../models/usuario");
var Medico = require("../models/medico");
var Hospital = require("../models/hospital");

app.put("/:tipo/:id", (req, res) => {
  var tipo = req.params.tipo;
  var id = req.params.id;
  //  Validar archvios recibidos
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: "No hay archivos seleccionados",
      errors: { message: "Debe seleccionar un archivo" }
    });
  }

  // Obtener el nombre del archivo
  var archivo = req.files.imagen;
  var nombreCortado = archivo.name.split(".");
  var extensionArchivo = nombreCortado[nombreCortado.length - 1];

  // Verifica el tipo de imagenes
  var coleccionesValidas = ["hospitales", "medicos", "usuarios"];
  if (coleccionesValidas.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "El tipo de coleccion de imagen no es valido",
      errors: {
        message:
          "Debe seleccionar un tipo de coleccion valida " +
          coleccionesValidas.join(", ")
      }
    });
  }

  // Verifica extensiones Validas
  var extensionesValidas = ["png", "jpg", "gif", "jpeg"];
  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "El archivo seleccionado no tiene una extension valida",
      errors: {
        message:
          "Debe seleccionar un archivo con las extensiones " +
          extensionesValidas.join(", ")
      }
    });
  }

  // standarizamos el nombre
  // IDusuario-numeroRandom.ext
  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
  
  //   Mover archivo a la carpeta adecuada
  var path = `./uploads/${tipo}/${nombreArchivo}`;

  archivo.mv(path, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error moviendo el archivo",
        errors: err
      });
    }

    subirPorTipo(tipo, id, nombreArchivo, res);

  });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
  if (tipo === "usuarios") {
    Usuario.findById(id, (err, usuario) => {
      if (!usuario) {
        return res.status(400).json({
            ok: false,
            mensaje: "Usuario no encontrado",
            errors: { message: "El usuario buscado no existe"}
          });
      }
      // Localizamos y borramos la imagen anterior
      var pathViejo = `./uploads/${tipo}/${usuario.img}`;
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo);
      }

      usuario.img = nombreArchivo;
      usuario.save((err, usuarioActualizado) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error actualizando la imagen",
            errors: err
          });
        }
        usuarioActualizado.password = ":S";

        return res.status(200).json({
          ok: true,
          mensaje: "Imagen actualizada con exito",
          usuario: usuarioActualizado
        });
      });
    });
  }

    if (tipo === "medicos") {
        Medico.findById(id, (err, medico) => {
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Medico no encontrado",
                    errors: { message: "El medico buscado no existe"}
                  });
            }
            // Localizamos y borramos la imagen anterior
            var pathViejo = `./uploads/${tipo}/${medico.img}`;
            if (fs.existsSync(pathViejo)) {
              fs.unlink(pathViejo);
            }
      
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
              if (err) {
                return res.status(500).json({
                  ok: false,
                  mensaje: "Error actualizando la imagen",
                  errors: err
                });
              }      
              return res.status(200).json({
                ok: true,
                mensaje: "Imagen actualizada con exito",
                medico: medicoActualizado
              });
            });
          });
    }

    if (tipo === "hospitales") {
        Hospital.findById(id, (err, hospital) => {
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Hospital no encontrado",
                    errors: { message: "El hospital buscado no existe"}
                  });
            }
            // Localizamos y borramos la imagen anterior
            var pathViejo = `./uploads/${tipo}/${hospital.img}`;
            if (fs.existsSync(pathViejo)) {
                console.log('eliminar archivo');
              fs.unlink(pathViejo);
            }
      
            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {
              if (err) {
                return res.status(500).json({
                  ok: false,
                  mensaje: "Error actualizando la imagen",
                  errors: err
                });
              }      
              return res.status(200).json({
                ok: true,
                mensaje: "Imagen actualizada con exito",
                hospital: hospitalActualizado
              });
            });
          });
    }
}

module.exports = app;
