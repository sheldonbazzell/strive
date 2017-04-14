 var express = require('express'), 
     bp      = require('body-parser'), 
     path    = require('path'), 
     port    = process.env.PORT || 8000, 
     app     = express();
     Parse   = require('parse'),
     session = require('express-session');

var rollbar = require("rollbar");
rollbar.init("712fef780bfd4c4f8f8088c1be24e48b");

rollbar.reportMessage("Hello world!");

var passport = require('passport');
var StravaStrategy = require('passport-strava').Strategy;

var STRAVA_CLIENT_ID = process.env.CLIENT_ID || '17197';
var STRAVA_CLIENT_SECRET = process.env.CLIENT_SECRET || 'a87cb9f889914798567026344d6c0feeb939e206';

var TokenRequest = Parse.Object.extend("TokenRequest");
var TokenStorage = Parse.Object.extend("TokenStorage");

var restrictedAcl = new Parse.ACL();
restrictedAcl.setPublicReadAccess(false);
restrictedAcl.setPublicWriteAccess(false);

passport.use(new StravaStrategy({
    clientID: STRAVA_CLIENT_ID,
    clientSecret: STRAVA_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:8000/index"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ stravaId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

app.use( express.static( path.join( __dirname, 'client' ))); 
app.use( express.static( path.join( __dirname, 'bower_components' ))); 
app.set("views",path.join(__dirname,"./client"));
app.set("view engine", "ejs");
app.use( bp.json() ); 
require('./server/config/mongoose.js'); 
var routes = require('./server/config/routes.js')
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: "This is a secret"
}));
routes(app); 
app.listen( port, function(){}); 
