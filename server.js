const express = require("express");
const app = express();
const server = require("http").Server(app);

app.get('/', function (req, res) {
    res.send('<h1>hello world</h1>')
});
server.listen(3000);
