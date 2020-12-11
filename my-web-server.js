/**
 *  Module dependencies
 */

var express = require('express')
  , mongodb = require('mongodb');

/**
 * Set up application.
 */

app = express.createServer();

/**
 * Middleware.
 */

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'my secret' }));

/**
 * Specify your views options.
 */

app.set('view engine', 'jade');

app.set('view options', { layout: false });

/**
 * Default route
 */

app.get('/', function (req,res) {
  res.render('index', { authenticated: false });
});

/**
 * Login route
 */

app.get('/login', function (req, res) {
  res.render('login');
});

/**
 * Signup route
 */

app.get('/signup', function (req,res) {
  res.render('signup');
});

/**
 * Listen
 */

app.listen(3000);

/**
* Connect to the database.
*/

var server = new mongodb.Server('127.0.0.1', 27017)

new mongodb.Db('my-website', server).connect(function (err, client){
	// don't allow the app to start if there was an error
	if(err) throw err;
	console.log('\033[96m + \033[39m connected to mongodb');
	// set up collection shortcuts
	app.users = new mongodb.collection(client, 'users');

	// listen
	app.listen(3000, function () {
		console.log('\033[96m + \033[39m app listening on *:3000');
	})
})