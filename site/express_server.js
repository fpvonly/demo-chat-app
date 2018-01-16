var express = require('express');
var session = require('express-session')
var bodyParser =  require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var passwordHash = require('password-hash');
var path = require('path');
var fs = require('fs');
var url = require('url');
var nodemailer = require('nodemailer');
var auth = require('http-auth');
var socketserver = require('websocket').server;  // for websockets chat
var Converter = require("csvtojson").Converter;
var database = require('./database');

var mongo = new database();

var clients = {}; // for websockets chat
var count = 0; // for websockets chat

var LANG = 'en';

// auth
var basic = auth.basic({
  realm: "Private area!",
  file: __dirname + "/htpasswd",
  type: "basic"
});

// start server
var app = express();
var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
});

// basic auth for new user account (type -> admin) creation
app.use(function(req, res, next) {
    if (req.path.indexOf('/admin/create') !== -1) {
      (auth.connect(basic))(req, res, next);
    } else {
      next();
    }
});

// multipart file upload settings
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
  	var file_name = file.originalname.split('.').join( '-' + Date.now() + '.' );
    cb(null, file_name );
  }
})
var upload = multer({ storage: storage });

// serve css, images, js etc
app.use( '/assets', express.static( path.join( __dirname, 'assets') ) );
app.use( '/build', express.static( path.join( __dirname, 'build') ) );

// POST params conf
app.use( bodyParser.urlencoded({ extended: true }) );

// Cookies
app.use( cookieParser() );

// Session
app.use( session({
  secret: 'nonono',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 86400000}
}));

app.use(function(req, res, next) {
  if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    //res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  } else {
    // TODO if needed in the future
    //res.header("Access-Control-Allow-Origin", "TODO");
  }
  next();
});

// GET routes ->

app.get( '/', function( req, res ) {
		res.sendFile(  __dirname+'/index.html' );
	}
);

app.get('/admin/create/:username/:password', function(req, res) {
	var hashedPassword = passwordHash.generate(req.params.password);

  mongo.insert({
      username: req.params.username,
      password: hashedPassword,
      timestamp: new Date()
  },
  'users',
  function(result) {
    if (result === true) {
      res.send('User created');
    } else {
      res.send('error');
    }
  });
});

/*
app.get( '/dataload/:page', function( req, res ) {
	renderViewAndLoc( res, req.params.page, req.params.page+'_text', LANG, {} );
});

app.get('/uploads/:filename', function (req, res, next ) {
 	if( isAuthenticated( req, res, next ) )
	{
  	 	res.sendFile( __dirname + '/uploads/'+req.params.filename );
  	}
  	else
  	{
  		res.send(401);
  	}
});
*/
/*
app.get('/uploaded_files/', function (req, res, next ) {
 	if( isAuthenticated( req, res, next ) )
	{
  	 	fs.readdir( __dirname + '/uploads/', function(err, items) {
		    console.log(items);

		    for (var i=0; i<items.length; i++) {
		        console.log(items[i]);
		    }
		});
  	}
  	else
  	{
  		res.send(401);
  	}
});
*/



// POST routes
app.post('/login/:action', function(req, res, next) {
  if (req.params.action === 'status') {
    if (isAuthenticated(req, res, next) === true) {
      res.contentType('application/json');
      res.cookie('utype', 1, { maxAge: 86400000, httpOnly: false });
      res.send({
        'login': true,
        'user_id': req.session.user_id,
        'username': req.session.username
      });
    } else {
      res.contentType('application/json');
      res.cookie('utype', 0, { maxAge: 1, httpOnly: false });
      res.send({'login': false});
    }
  } else if(req.params.action === 'admin' && req.body.username && req.body.password) {
      mongo.find('users', { username: req.body.username}, { fields: { username: 1, password: 1 } },
        function(err, result) {
          if (err === null && Array.isArray(result) && result.length > 0) {
            let userHits = [];
            for (let i = 0; i < result.length; i++) {
              if (passwordHash.verify(req.body.password, result[i].password)) {
                userHits.push(result[i]);
              }
            }
            if (userHits.length === 1) {
              res.contentType('application/json');
              res.cookie('utype', 1, { maxAge: 86400000, httpOnly: false });
              req.session.user_id = userHits[0]._id;
              req.session.username = userHits[0].username;
              res.send({
                'login': true,
                'user_id': req.session.user_id,
                'username': req.session.username
              });
            } else {
              res.contentType('application/json');
              res.cookie('utype', 0, { maxAge: 1, httpOnly: false });
              res.send({'login': false});
            }
          } else {
            res.contentType('application/json');
            res.cookie('utype', 0, { maxAge: 1, httpOnly: false });
            res.send({'login': false});
          }
      });
  }
  // DEBUG
  if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
    console.log('REQ SESSION OBJECT:', req.session);
  }
});

app.post( '/logout', function( req, res ) {
  req.session.destroy(function(err) {
    res.contentType('application/json');
    res.cookie('utype', 0, { maxAge: 1, httpOnly: false });
    res.send({'logout': true});
  });
});

app.post( '/admin/deletemessage', function( req, res, next ) {
		if (isAuthenticated(req, res, next) === true) {
      mongo.deleteOneById('messages', {_id: req.body.id}, function(status) {
        res.contentType('application/json');
        res.send({
          'deleted': status
        });
      });
		} else {
      res.contentType('application/json');
      res.send({
        'deleted': false
      });
		}
	}
);

/*
app.post('/admin/upload', [ isAuthenticatedForUpload, upload.array('file'), finishUpload ], function (req, res, next) {
    res.sendStatus(204);
});

app.post( '/admin/:action', function( req, res ) {
		fs.readFile( './views/menu.js', function( err, json ) {
			var menuObj = JSON.parse( json );

			if( req.params.action == 'login' )
			{
				if( req.body.admin_username && req.body.admin_password )
				{
					database.query("SELECT count(user.id) AS cnt, user.* FROM (SELECT * from users) AS user WHERE username=" + database.escape( req.body.admin_username ) + "", function(err, rows, fields) {
						for( var r in rows )
						{
							if( rows[r].cnt == 1 )
							{
								if( passwordHash.verify( req.body.admin_password, rows[r].password ) )
								{
									req.session.user_id = rows[r].id;
									req.session.username = rows[r].username;
									res.cookie('utype', 1, { maxAge: 86400000, httpOnly: false });

									//console.log("user_ID:" +req.session.user_id);
									break;
								}
							}
						}

						if( typeof req.session.user_id != 'undefined' && req.session.user_id > 0 )
						{
							renderViewAndLoc( res, 'admin_index', 'index_chat_text', LANG, { type:'admin', auth_obj: { user_id: req.session.user_id, username: req.session.username }, username: '', password: '', domain: req.protocol + '://' + req.hostname, footer_text: '© ' + new Date().getFullYear() + ' Ari Petäjäjärvi', menu: menuObj.menu} );
						}
						else
						{
							renderViewAndLoc( res, 'admin_index', 'index_chat_text', LANG, { type:'admin', auth_obj: {}, username: req.body.admin_username, password: req.body.admin_password, domain: req.protocol + '://' + req.get('host'), footer_text: '© ' + new Date().getFullYear() + ' Ari Petäjäjärvi', menu: menuObj.menu} );
						}


					});
				}
				else
				{
					renderViewAndLoc( res, 'admin_index', 'index_chat_text', LANG, { type:'admin', auth_obj: {}, username: req.body.admin_username, password: req.body.admin_password, domain: req.protocol + '://' + req.get('host'), footer_text: '© ' + new Date().getFullYear() + ' Ari Petäjäjärvi', menu: menuObj.menu} );
				}
			}
		});
	}
);

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
*/

// Special cases -->

// 404
app.use( function( req, res, next ) {
	res.status(404).send('Sorry! Nothing found :(');
});

// errors (for example file not found)
app.use( function(err, req, res, next) {
	res.status(500).send('Something broke! ' + err.stack);
});


// Helper functions -->

function isAuthenticated(req, res, next) {
	if(typeof req.session.user_id !== 'undefined') {
		return true;
	}	else {
		return false;
	}
}

// File upload helper functions
function isAuthenticatedForUpload(req, res, next) {
	if(typeof req.session.user_id != 'undefined' && req.session.user_id > 0) {
		next();
	}	else {
		res.sendStatus(401);
	}
}

function finishUpload(req, res, next) {
	fs.readdir( __dirname + '/uploads/', function(err, items) {
	    //console.log(items);
	    var list = '<ul>';
	    for(var i = 0; i < items.length; i++) {
	        list += '<li><a target="_blank" href="' + req.protocol + '://' + req.hostname + '/uploads/' + items[i] + '">' + items[i] + '</a></li>';
	    }
	    list += '</ul>';
	    res.send( list );
	});
}

getCurrentTime = (date) => {
  var d = (date ? new Date(date) : new Date());
  var offset = (new Date().getTimezoneOffset() / 60) * -1;
  var n = new Date(d.getTime() + offset);
  var time = n.getDate() + '.' + (n.getMonth() + 1) + '.' + n.getFullYear() + '  '
    + (n.getHours() < 10 ? '0' : '') + n.getHours() + ':' + (n.getMinutes() < 10 ? '0' : '') + n.getMinutes();
  return time;
};


// WEB SOCKETS FUNCTIONALITY, chat -->

var socket = new socketserver({
	httpServer: server
});

socket.on('request', function(request) {
	var connection = request.accept(null, request.origin);
	count++;
	connection.id = count;
	clients[count] = connection;

  connection.sendUTF(JSON.stringify({message: 'Welcome. Logged in.'}));

  mongo.find('messages', false, { fields: {message: 1, user_name: 1, email: 1, timestamp: 1/*, _id: 0*/}, limit: 100, sort: {timestamp: 1} }, function(err, results) {
    if (Array.isArray(results) === true) {
      connection.sendUTF(JSON.stringify(results));
    } else {
      connection.sendUTF(JSON.stringify({
        custom: "Sorry! Problems with the database..."
      }));
    }

    //console.log("RESULTS", results);
  });

	connection.on('message', function(message) {
		if(mongo)	{
			// 0: message
			// 1: chat name
			// 2: email
			var msg_parts = message.utf8Data.split(';');
			var message_text = msg_parts[0];
			var chat_name = msg_parts[1];
			var email = msg_parts[2];

      mongo.insert({
          message: message_text,
          user_name: chat_name,
          email: email,
          ip: request.remoteAddress,
          timestamp: new Date()
      },
      'messages',
      function(status, result) {
        if (result) {
          console.log( chat_name + ':' + message_text );
          for(var i in clients)	{
            clients[i].sendUTF(
              JSON.stringify({
                message: result.ops[0].message,
                timestamp: result.ops[0].timestamp,
                user_name: result.ops[0].user_name,
                _id: result.ops[0]._id
              })
            );
    			}
        }
      });

			/*var transporter = nodemailer.createTransport();
			transporter.sendMail({
				from: 'chat@petajajarvi.net',
				to: 'aripetaj@gmail.com',
				subject: 'New chat message',
				text: currentTime + ' ' + chat_name + ':\n\n'+ message_text + '\n\nemail: ' + email
			});*/
		}
	});

	connection.on('close', function( reasonCode, description ) {
		//console.log('\nCLIENT IDS ACTIVE:\n ');
		for(var i in clients) {
			if(i == connection.id) {
				 delete clients[i]; // delete the closed connection object from the client OBJECT LITERAL
			}	else {
				//console.log( i );
			}
		}
		console.log('connection closed');
	});

});
