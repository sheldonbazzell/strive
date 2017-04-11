 var express = require('express'), 
     bp      = require('body-parser'), 
     path    = require('path'), 
     port    = process.env.PORT || 8000, 
     app     = express(); 
	app.use( express.static( path.join( __dirname, 'client' ))); 
	app.use( express.static( path.join( __dirname, 'bower_components' ))); 
	app.set("views",path.join(__dirname,"./client"));
	app.set("view engine", "ejs");
	app.use( bp.json() ); 
	require('./server/config/mongoose.js'); 
	require('./server/config/routes.js')(app); 
	app.listen( port, function(){}); 
