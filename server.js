/**
* Connect to the database.
*/

var server = new mongodb.Server('127.0.0.1', 27017)

new mongodb.Db('my-website', server).open(function (err, client){
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