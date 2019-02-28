var jwt = require("jsonwebtoken");

SEED = require("../config/config").SEED;

// ==========================================================
// Middleware: Verificar token
// Todos los metodos siguientes son protegidos por el token
// ==========================================================

exports.verificaToken = function(req, res, next) {
  var token = req.query.token;

  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        mensaje: "Token no valido o expirado ",
        errors: err
      });
    }

    req.usuario = decoded.usuario;
    next();
    // return res.status(200).json({
    //   ok: false,
    //   decoded: decoded
    // });
  });
};
