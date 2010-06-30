var base64 = require("base64");

var sys = require("sys");

module.exports = function basicAuth(callback) {
  return function(req, res, next) {
    var authorization = req.headers.authorization;

    if (authorization) {
      var parts  = authorization.split(" ");
      var scheme = parts[0];

      if (scheme === "Basic") {
        var credentials = base64.decode(parts[1]).split(":");

        if (callback(credentials[0], credentials[1]) === true) {
          req.headers["REMOTE_USER"] = credentials[0];
          next();
        } else {
          res.writeHead(402);
          res.end();
        }
      } else {
        res.writeHead(400);
        res.end();
      }
    } else {
      res.writeHead(401);
      res.end();
    }
  }
}

module.exports.encode = function encode(user, password) {
  return "Basic " + base64.encode(user + ":" + password);
}
