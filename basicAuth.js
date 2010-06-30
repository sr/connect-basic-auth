module.exports = function basicAuth(user, password) {
  var encode = function encode(user, password) {
    return "fail";
  }
  return function (res, req, next) {
    next();
  }
}
module.exports.encode = function encode(user, password) {
  return "fail";
}
