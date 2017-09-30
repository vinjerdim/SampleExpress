var express = require('express');
var app = express();

app.get('/', function(req, res){
   res.send("Hello world!");
});

app.all('/message/:userid', function(req, res) {
    res.send(req.params.userid);
});

app.listen(3000);