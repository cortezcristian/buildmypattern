
/**
 * Module dependencies. 
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  // Global Configurations
  , mainDomain = "buildmypattern.jit.su"
  , mainPort = 80
  , dbDomain = 'ds039257.mongolab.com:39257'
  , dbName = 'nodejitsu_cortezcristian_nodejitsudb5110793134'
  , dbUser = 'nodejitsu_cortezcristian'
  , dbPass = '7hhta9aok10tc0raqrqbei8jmt';
  
switch(process.env.NODE_ENV){
	case 'development':
		mainDomain = "127.0.0.1";
		mainPort = 8000;
		dbDomain = 'localhost';
		dbName = 'buildmypattern_dev';
		dbUser = null;
		dbPass = null;
	break;
	case 'production':
	break;
	default:
		if(typeof process.env.NODE_ENV == 'undefined'){
			mainDomain = "127.0.0.1";
			mainPort = 8000;
			dbDomain = 'localhost';
			dbName = 'buildmypattern_dev';
			dbUser = null;
			dbPass = null;
			process.env.NODE_ENV = 'development'
		}
	break;
}
console.log('Environment set to:'+process.env.NODE_ENV);
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || mainPort);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
