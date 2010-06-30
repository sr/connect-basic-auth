var connect   = require("connect"),
    basicAuth = require("basicAuth"),
    base64    = require("base64");

var server = connect.createServer(
  basicAuth(function (user, password) {
    return user === "user" && password == "password"
  }),
  function (req, res) {
    res.writeHead(200);
    res.close("welcome " + req.headers.REMOTE_USER);
  }
);

module.exports = {
  "test valid credentials": function (assert) {
    var headers = {authorization: basicAuth.encode("user", "password")};

    assert.response(server,
      {url: "/", headers: headers},
      {status: 200, body: "welcome user"}
    );
  },

  "test invalid credentials": function (assert) {
    var headers = {authorization: basicAuth.encode("foo", "bar")};
    assert.response(server,
      {url: "/", headers: headers},
      {status: 402}
    );
  },

  "test missing Authorization": function (assert) {
    assert.response(server,
      {url: "/"},
      {status: 400}
    );
  },

  "test not a basic request": function (assert) {
    var headers = {authorization: "Foo " + base64.encode("user:password")};

    assert.response(server,
      {url: "/", headers: headers},
      {status: 400}
    );
  }
}
