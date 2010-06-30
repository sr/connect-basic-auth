var base64 = require("base64");

var sys = require("sys");

module.exports = function basicAuth(callback) {
  function unauthorized(res) {
    res.writeHead(401);
    res.end();
  }

  return function(req, res, next) {
    var authorization = req.headers.authorization;

    if (!authorization)
      unauthorized(res);

    var parts       = authorization.split(" ");
    var scheme      = parts[0];
    var credentials = base64.decode(parts[1]).split(":");

    if (scheme !== "Basic") {
      res.writeHead(400);
      res.end();
    }

    if (callback(credentials[0], credentials[1]) === true) {
      req.headers["remote_user"] = credentials[0];
      next();
    } else {
      unauthorized(res);
    }
  }
}

