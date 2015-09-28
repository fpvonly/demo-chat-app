var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var auth = require("http-auth");
var socketserver = require('websocket').server;
var database = require('./database');
var nodemailer = require('nodemailer');




var basic = auth.basic({
  realm: "Private area",
  file: __dirname + "/htpasswd",
  type: "basic"
});


var ext = /[\w\d_-]+\.[\w\d]+$/;

var clients = {};
var count = 0;

var suffixes =  {
	'css':'text/css',
	'js':'text/javascript', 
	'html':'text/html', 
	'png':'image/png', 
	'jpg':'image/jpg',
	'jpeg':'image/jpeg',
	'gif':'image/gif'
};



var httpServerObj = http.createServer( function( req, res ) {
	var POST = {};
	var GET = {};
	
	if( req.method == 'GET' )
	{
		GET = url.parse( req.url, true ).query;
		processHTTPCall( req, res, 'GET',GET );
		//console.log('GET: ' +GET.test );
	}
	if( req.method == 'POST' )
	{
		var body = '';
		req.on('data', function( data ) {
			body += data;
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if( body.length > 1e6 )
			{ 
				// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
				req.connection.destroy();
			}
		});
		req.on('end', function(){
			POST =  qs.parse( body );
			processHTTPCall( req, res, 'POST', POST );
			//console.log(POST.test);
		});								
	}

	
}).listen(80);

var processHTTPCall = function( req, res, type, methodObj )
{
	
	method = methodObj;
	
	//console.log('METHOD '+type);
	
	// index
	if( req.url === '/' ) 
	{						
		fs.readFile( './index.html', function( err, html ) {
			if( err ) 
			{
				 notFound( err, html, res );			
			}
			else
			{
				res.writeHead( 200, {'Content-Type': 'text/html'} );
				res.write( html );  	
				res.end();  					
			}								
		});					
	}
	// partial content loads
	else if( req.url.indexOf('dataload') != -1 )
	{
		fs.readFile( './views/'+method.target+'.html', function( err, html ) {
			if( err ) 
			{
				 notFound( err, html, res );			
			}
			else
			{
				res.writeHead( 200, {'Content-Type': 'text/html'} );
				res.write( html );  	
				res.end();  					
			}								
		});
	}
	// contact form etc
	else if( req.url.indexOf('datasend') != -1 )
	{
		if( req.url.indexOf('/contact') != -1 )
		{		
			var transporter = nodemailer.createTransport();
			var currentTime = getCurrentTime();			
			transporter.sendMail({
				from: 'contact@petajajarvi.net',
				to: 'aripetaj@gmail.com',
				subject: 'New contact message',
				text: currentTime + ' ' + method.contact_name + ':\n\n'+ method.contact_message + '\n\nemail: ' + method.contact_email
			});
			
			res.writeHead( 200, {'Content-Type': 'text/html'} );
			res.write( 'datasend_success' );  	
			res.end(); 
		}
		else
		{
			notFound( '', '', res );			
		}
	}	
	// all other resources and pages
	else
	{				
		var path_to_target = '';
		if( req.url.indexOf('assets/') == -1 )
		{
			path_to_target = './assets/'+req.url;
		}
		else
		{
			path_to_target = '.'+req.url;
		}
	    fs.readFile( path_to_target, function (err, data) {
			if( err )
			{		
				notFound( err, data, res );		
			}
			else
			{
				var suffix = '';
				for( var prop in suffixes ) 
				{
					if( req.url.indexOf( '.'+prop ) != -1)
					{							
						suffix = prop;
						break;
					}
				}
		
				if( suffix != '' )
				{ 						
					res.writeHead( 200, {'Content-Type': suffixes[ suffix ]} );
					res.write( data );
					res.end();
				}
				else
				{						
					notFound( true, '404', res );
				}
			}
		  });
	}

	function notFound( err, data, res ) 
	{
		res.writeHead( 404, {'Content-Type': 'text/html'} );
		res.write('404: Content not found.'); 
		res.end();
	}	
}




// WEB SOCKETS FUNC, chat

var socket = new socketserver({
	httpServer: httpServerObj
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


function printPropsToLog( o )
{
	for( var prop in o ) 
	{
		console.log('prop: '+prop);
	}
}

function getCurrentTime() {
  var d = new Date();
  var offset = (new Date().getTimezoneOffset() / 60) * -1;
  var n = new Date(d.getTime() + offset);
  var time =  n.getDate()+'.'+(n.getMonth()+1)+'.'+n.getFullYear()+'  '+n.getHours()+':'+n.getMinutes();
  return time;
};