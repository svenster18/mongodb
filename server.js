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
* Authentication middleware.
*/

app.use(function (req, res, next) {
	var ObjectId = require('mongodb').ObjectId;
	var id = req.session.loggedIn;
	var o_id = new ObjectId(id);
	if (id) {
		res.local('authenticated', true);
		app.users.findOne({_id: o_id }, function (err, doc) {
			if (err) return next(err);
			res.local('me', doc);
			next();
		});
	} else {
		res.local('authenticated', false);
		next();
	}
});

/**
 * Default route
 */
app.get('/', function (req,res) {
  res.render('index');
});

/**
 * Login route
 */

app.get('/login', function (req, res) {
  res.render('login', { signupEmail : null});
});

app.get('/login/:signupEmail', function (req, res) {
  res.render('login', { signupEmail: req.params.signupEmail });
});

/**
 * Signup route
 */

app.get('/signup', function (req,res) {
  res.render('signup');
});

/**
* Logout route.
*/

app.get('/logout', function (req, res) {
	req.session.loggedIn = null;
	res.redirect('/');
})
/**
* Connect to the database.
*/

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/my-website";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  //console.log("Database created!");
  console.log('\033[96m + \033[39m connected to mongodb');
  // set up collection shortcuts
  var dbo = db.db("my-website");
  if(dbo.collection('users')){
  	app.users = dbo.collection('users');
  }
  else{
  	dbo.createCollection("users", function(err, res) {
	    if (err) throw err;
	    console.log("Collection created!");
  	});
  }
  

  app.users.createIndex('users', 'email', function (err) {
	if (err) throw err;
	app.users.createIndex('users', 'password', function (err) {
		if (err) throw err;

		console.log('\033[96m + \033[39m ensure indexes');

		//listen
		app.listen(3000, function () {
			console.log('\033[96m + \033[39m app listening on *:3000');
		});
	});
  });
});

/**
* Signup processing route
*/

app.post('/signup', function (req, res, next) {
	app.users.insertOne(req.body.user, function (err, doc) {
		if (err) return next(err);
		console.log("1 document inserted");
		res.redirect('/login/' + req.body.user.email);
	});
});

/**
* Login process route
*/

app.post('/login', function (req, res) {
	app.users.findOne({ email: req.body.user.email, password: req.body.user.password }, function (err,doc) {
		if (err) return next(err);
		if (!doc) return res.send('<p>User not found. Go back and try again</p>');
		req.session.loggedIn = doc._id.toString();
		res.redirect('/');
	});
});



