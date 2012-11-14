
/**
 * Module dependencies. 
 */

var express = require('express')
  //routes
  , routes = require('./routes')
  , user = require('./routes/user')
  , diagramRoute = require('./routes/diagram')
  // modules
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  // Global Configurations
  , mainDomain = "buildmypattern.jit.su"
  , mainPort = 80
  , dbDomain = 'ds039257.mongolab.com:39257'
  , dbName = 'nodejitsu_cortezcristian_nodejitsudb5110793134'
  , dbUser = 'nodejitsu_cortezcristian'
  , dbPass = '7hhta9aok10tc0raqrqbei8jmt'
  , TWITTER_CONSUMER_KEY = "QUE91keVwkNyFo80GzzSTQ"
  , TWITTER_CONSUMER_SECRET = "OFO0AwfOTC9zyWJ95Ew734fwxqQObh0zeYX8G4UAPxE"
  , FACEBOOK_APP_ID = "247634828697404"
  , FACEBOOK_APP_SECRET = "b86cdccb8a36ba141011fd5f5f4588cd"
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
  , SMserver = mainDomain;
  
switch(process.env.NODE_ENV){
	case 'development':
		mainDomain = "127.0.0.1";
		mainPort = 8000;
		dbDomain = 'localhost';
		dbName = 'buildmypattern_dev';
		dbUser = null;
		dbPass = null;
		SMserver = mainDomain+":"+mainPort;
	break;
	case 'production':
		mainDomain = "buildmypattern.com";
		SMserver = mainDomain;
	break;
	default:
		if(typeof process.env.NODE_ENV == 'undefined'){
			mainDomain = "127.0.0.1";
			mainPort = 8000;
			dbDomain = 'localhost';
			dbName = 'buildmypattern_dev';
			dbUser = null;
			dbPass = null;
			SMserver = mainDomain+":"+mainPort;
			process.env.NODE_ENV = 'development';
		}
	break;
}
console.log('Environment set to:'+process.env.NODE_ENV);
console.log('http://'+mainDomain+':'+mainPort+'/');
var app = express();
/**
* Session support
*/
passport.serializeUser(function(user, done) {
      done(null, user);
});

passport.deserializeUser(function(obj, done) {
      done(null, obj);
});

/**
* Express Configurations
*/
app.configure(function(){
  app.set('port', process.env.PORT || mainPort);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  
  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/**
* Routes
*/
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/diagram', /*ensureLoggedIn('/login'),*/ diagramRoute.edit);
/**
* Social Media Auth
*/
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://"+SMserver+"/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    var user = profile;
    return done(null, user);
  }
));
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://"+SMserver+"/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
	var user = profile;
	done(null, user);
  }
));
app.get('/account', ensureLoggedIn('/login'), function(req, res) {
	res.send('Hello ' + req.user.username);
});
app.get('/login', function(req, res) {
	res.send('<html><body><a href="/auth/twitter">Sign in with Twitter</a><br><a href="/auth/facebook">Sign in with Facebook</a></body></html>');
});
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successReturnToOrRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/facebook', passport.authenticate('facebook'), { scope: ['user_status', 'user_photos'] });
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successReturnToOrRedirect: '/', failureRedirect: '/login' }));
/**
* Start Server
*/
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

/**
* SocketIO
*/
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    socket.on('classCreated', function (data) {
        console.log("classCreated");
        socket.broadcast.emit('classCreation', data);
    });
	socket.on('classDragEnd', function (data) {
        console.log("classDragEnd");
        socket.broadcast.emit('classDrag', data);
    });
});
