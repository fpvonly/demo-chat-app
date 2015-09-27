var express = require('express');
var bodyParser =  require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var fs = require('fs');
var nodemailer = require('nodemailer');
var auth = require('http-auth');
var socketserver = require('websocket').server;  // for websockets chat
var database = require('./database');

var clients = {}; // for websockets chat
var count = 0; // for websockets chat

var basic = auth.basic({
  realm: "Private area",
  file: __dirname + "/htpasswd",
  type: "basic"
}); 

var app = express();

var server = app.listen(80, function() {
	var host = server.address().address;
	var port = server.address().port;
});

app.set( 'view engine', 'ejs' );
app.set( 'views', path.join( __dirname, 'views') );

// serve css, images, js etc
app.use( '/assets', express.static( path.join( __dirname, 'assets') ) );
//POST params conf
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( cookieParser() );





// GET routes
// second param: auth.connect(basic)
app.get( '/', function( req, res ) {
		//console.log('COOKIE: '+req.cookies.email);
		//console.log('COOKIE: '+req.cookies.chat_name);
		res.render('index', { footer_text: '© ' + new Date().getFullYear() + ' Ari Petäjäjärvi'});
		//res.sendFile(  __dirname+'/index.html' );
	}
);

app.get( '/dataload/:page', function( req, res ) {		
		res.render( req.params.page, { });

	}
);


// POST routes
/*
app.post( '/', function (req, res) {
	res.contentType('text/html');
	res.send('Got a POST request');
});*/

app.post( '/datasend/contact', function( req, res ) {
		var transporter = nodemailer.createTransport();
		var currentTime = getCurrentTime();			
		transporter.sendMail({
			from: 'contact@petajajarvi.net',
			to: 'aripetaj@gmail.com',
			subject: 'New contact message',
			text: currentTime + ' ' + req.body.contact_name + ':\n\n'+ req.body.contact_message + '\n\nemail: ' + req.body.contact_email
		});
		
		res.contentType('text/html');
		res.send( 'datasend_success' );  	
		res.end(); 
	}
);

// 404
app.use( function( req, res, next ) {
	res.status(404).send('Sorry! Nothing found :(');
});

//errors (for example file not found)
app.use( function(err, req, res, next) {
	res.status(500).send('Something broke! '+err.stack); // +err.stack
});







// WEB SOCKETS FUNC, chat

var socket = new socketserver({
	httpServer: server
});

socket.on('request', function(request) {
	var connection = request.accept(null, request.origin);
	count++;
	connection.id = count;
	clients[ count ] =  connection;
	database.query("SELECT * from ( SELECT * FROM chat_log ORDER BY date DESC LIMIT 10 ) AS t ORDER BY date ASC", function(err, rows, fields) {
		for( var r in rows ) 
		{				
			var dateObj = new Date( rows[r].date );
			var time =  dateObj.getDate()+'.'+(dateObj.getMonth()+1)+'.'+dateObj.getFullYear()+'  '+dateObj.getHours()+':'+dateObj.getMinutes();
			connection.sendUTF('  <span class="chat_name_span">' + time + ' ' +  rows[r].avatar + ':</span><span class="message_text_span"> ' + rows[r].message + '</span>'  );					
		}
	});
	
	
	connection.on('message', function(message) {
		if( database )
		{
			// 0: message
			// 1: chat name
			// 2: email
			var msg_parts = message.utf8Data.split(';');
			var message_text = msg_parts[0];
			var chat_name = msg_parts[1];
			var email = msg_parts[2];
		
			console.log( chat_name + ':' + message_text );
			console.log('\nCLIENT IDS ACTIVE:\n ');
			
			var currentTime = getCurrentTime();			
			
			for( var i in clients ) 
			{
				clients[i].sendUTF('  <span class="chat_name_span">' + currentTime + ' ' + chat_name + ':</span><span class="message_text_span">' + message_text + "</span>"  );
				console.log( i );
			}
			
			database.query("INSERT INTO chat_log ( message, avatar, email, ip ) VALUES ( " + database.escape(message_text) + ", " + database.escape(chat_name) + ", " + database.escape(email) + ", '" + request.remoteAddress + "' )", function(err,rows){
			});
			
			var transporter = nodemailer.createTransport();
			transporter.sendMail({
				from: 'chat@petajajarvi.net',
				to: 'aripetaj@gmail.com',
				subject: 'New chat message',
				text: currentTime + ' ' + chat_name + ':\n\n'+ message_text + '\n\nemail: ' + email
			});
		}
	});

	connection.on('close', function( reasonCode, description ) {
		console.log('\nCLIENT IDS ACTIVE:\n ');
		for( var i in clients ) 
		{
			if( i == connection.id )
			{
				 delete clients[ i ];
			}
			else
			{
				console.log( i );
			}
		}
		console.log('connection closed');
	});
	
});









function getCurrentTime() {
  var d = new Date();
  var offset = (new Date().getTimezoneOffset() / 60) * -1;
  var n = new Date(d.getTime() + offset);
  var time =  n.getDate()+'.'+(n.getMonth()+1)+'.'+n.getFullYear()+'  '+n.getHours()+':'+n.getMinutes();
  return time;
};