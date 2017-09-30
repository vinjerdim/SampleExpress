var express = require('express');
var app = express();
var admin = require("firebase-admin");
var serviceAccount = require(__dirname + "/key/serviceAccountKey.json");

var firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-notify-24c1c.firebaseio.com"
});

var authAdmin = admin.auth();
var dbAdmin = admin.database();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
    res.send("Hello");
});

app.get('/users', function(req, res){
    var username = req.query.username;
    var password = req.query.password;
    var email = req.query.email;

    createNewUser(username, password, email);
    res.send(username + ' ' + password + ' ' + email);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function createNewUser(mUsername, mPassword, mEmail) {
    authAdmin.createUser({
        email : mEmail,
        displayName : mUsername,
        password : mPassword
    }).then(function(userRecord) {
        var mUid = userRecord.uid;
        console.log('Successfully created user ' + mUid);
        insertNewUser(mUid, mUsername, mPassword, mEmail);
    }).catch(function(error) {
        console.log('Error creating user ' + error);
    });
}

function insertNewUser(mUid, mUsername, mPassword, mEmail) {
    var node = dbAdmin.ref('users/' + mUid);
    node.set({
        username : mUsername,
        password : mPassword,
        email : mEmail
    });
}