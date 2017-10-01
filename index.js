var express = require('express');
var app = express();
var admin = require("firebase-admin");
var serviceAccount = require(__dirname + "/key/serviceAccountKey.json");

var firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ppav-76b26.firebaseio.com"
});

var authAdmin = admin.auth();
var dbAdmin = admin.database();
var msgAdmin = admin.messaging();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
    res.send("Hello");
});

app.get('/users', function(req, res){
    var username = req.query.username;
    var password = req.query.password;
    var email = req.query.email;
    var token = req.query.token;

    createNewUser(username, password, email, token);
    res.send(username + ' ' + password + ' ' + email);
});

app.get('/notify/:uid', function(req, res){
    var uid = req.params.uid;
    var userRef = dbAdmin.ref(uid);
    userRef.child("notificationRequest").set(1);

    userRef.on("value", function(snapshot) {
        var nr = snapshot.child("notificationRequest").val() == 1;
        if (nr) {
            var token = snapshot.child("token").val();
            var totalQuest = snapshot.child("quests").numChildren();
            var payload = {
              notification: {
                title: "You have " + totalQuest + " quests",
                body: "Tap here to open your quests"
              }
            };

            var options = {
              priority: "high",
              restrictedPackageName: "com.mrvins.android.ppav"
            };

            msgAdmin.sendToDevice(token, payload, options).then(function(res) {
                console.log("Message sent ", res);
            }).catch(function(err) {
                console.log("Message failed ", err);
            });
        }
    });

    res.send("OK");
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function createNewUser(mUsername, mPassword, mEmail, mToken) {
    authAdmin.createUser({
        email : mEmail,
        displayName : mUsername,
        password : mPassword
    }).then(function(userRecord) {
        var mUid = userRecord.uid;
        console.log('Successfully created user ' + mUid);
        insertNewUser(mUid, mUsername, mPassword, mEmail, mToken);
    }).catch(function(error) {
        console.log('Error creating user ' + error);
    });
}

function insertNewUser(mUid, mUsername, mPassword, mEmail, mToken) {
    var node = dbAdmin.ref('users/' + mUid);
    node.set({
        username : mUsername,
        password : mPassword,
        email : mEmail,
        token : mToken
    });
}