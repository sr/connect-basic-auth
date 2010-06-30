var base64 = require("base64");

var sys = require("sys");

module.exports = function basicAuth(callback) {
  return function(req, res, next) {
    res.unauthorized = function () {
      this.writeHead(401);
      this.end();
    };

    var authorization = req.headers.authorization;

    if (authorization) {
      var parts  = authorization.split(" ");
      var scheme = parts[0];

      if (scheme === "Basic") {
        var credentials = base64.decode(parts[1]).split(":");

        if (callback(credentials[0], credentials[1]) === true) {
          req.headers["remote_user"] = credentials[0];
          next();
        } else {
          res.unauthorized();
        }
      } else {
        res.writeHead(400);
        res.end();
      }
    } else {
      res.unauthorized();
    }
  }
}

module.exports.encode = function encode(user, password) {
  return "Basic " + base64.encode(user + ":" + password);
}
