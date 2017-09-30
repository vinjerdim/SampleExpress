var express = require('express');
var app = express();

var admin = require("firebase-admin");

var serviceAccount = require("key/serviceAccountKey.json");

var firebase_app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-notify-24c1c.firebaseio.com"
});

console.log(firebase_app.options.credential);
console.log(firebase_app.options.databaseURL);

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res){
   res.send("Hello world!");
});

app.all('/message/:userid', function(req, res) {
    res.send(req.params.userid);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});