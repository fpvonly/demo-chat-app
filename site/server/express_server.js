const exec = require('child_process').exec;
const express = require('express');
const session = require('express-session');
const bodyParser =  require('body-parser');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const passwordHash = require('password-hash');
const path = require('path');
const fs = require('fs');
const url = require('url');
const nodemailer = require('nodemailer');
const argv = require('yargs').argv
const auth = require('http-auth');
const socketserver = require('websocket').server;
const database = require('./database');

const mongo = new database();

let clients = {}; // for websockets chat
let count = 0; // for websockets chat

let mailConfig = {
  'user': '',
  'password': ''
};
if (typeof argv.gmail !== 'undefined') {
  // email settings are given via command line
  mailConfig = {
    'user': argv.gmail.split(',')[0],
    'pass': argv.gmail.split(',')[1]
  };
}

// auth
let basic = auth.basic({
  realm: "Private area!",
  file: __dirname + "/htpasswd",
  type: "basic"
});

let app = express();
fs.readFile('server_config.json', function( err, json ) {

  /* ############## START HTTP SERVER ############## */
  let serverPort = null;
  if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
    serverPort = 3000;
  } else {
    serverPort = JSON.parse(json).server_port
  }

  let server = app.listen(serverPort, function() {
    // start websocket server for Chat functionality
    let socketServer = startSocketServer(server);

    process.on('SIGINT', function() {
      socketServer.shutDown();
      server.close(() => {
        process.exit(0);
      });
    });
    process.on('SIGTERM', function() {
      socketServer.shutDown();
      server.close(() => {
        process.exit(0);
      });
    });
  }); // ENDS app.listen
/* ############## ############## ############## */

  // basic auth for new user account (type -> admin) creation
  app.use(function(req, res, next) {
      if (req.path.indexOf('/admin/create') !== -1 ||
        req.path.indexOf('/admin/server/restart') !== -1) {
        (auth.connect(basic))(req, res, next);
      } else {
        next();
      }
  });

  // multipart file upload settings
  /*let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
    	let file_name = file.originalname.split('.').join('-' + Date.now() + '.');
      cb(null, file_name );
    }
  })
  let upload = multer({ storage: storage });*/

  // serve css, images, js etc
  app.use('/assets', express.static( path.resolve('../assets')));
  app.use('/build', express.static( path.resolve('../build')));

  // POST params conf
  app.use(bodyParser.urlencoded({ extended: true }));

  // Cookies
  app.use(cookieParser());

  // Session
  app.use(session({
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

  // maintenance purposes only
  app.get('/admin/server/restart', function(req, res) {
    child = exec("cd " + __dirname + "&& sudo npm run foreverrestart", function (error, stdout, stderr) {
      if (error !== null) {
        res.contentType('application/json');
        res.send({'restart': false});
      } else {
        res.contentType('application/json');
        res.send({'restart': true});
      }
    });
  });

  app.get('/admin/create/:username/:password', function(req, res) {
    let hashedPassword = passwordHash.generate(req.params.password);

    mongo.insert(
      {
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
      }
    );
  });

  app.get('/*', function(req, res) {
    res.sendFile(path.resolve('../index.html'));
  });

  // POST routes

  app.post('/contact/send', function(req, res) {
    try {
      let transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: mailConfig.user, pass: mailConfig.pass } });
      transporter.sendMail(
        {
          from: 'contact@petajajarvi.net',
          to: 'aripetaj@gmail.com',
          subject: 'New contact message',
          text: new Date() + ' ' + req.body.contact_name + ':\n\n'+ req.body.contact_message + '\n\nemail: ' + req.body.contact_email
        },
        function(error, info) {
          if (error) {
            res.contentType('application/json');
            res.send({'status': false});
          } else {
            res.contentType('application/json');
        		res.send({'status': true});
          }
        }
      );
    } catch (err) {
      res.contentType('application/json');
      res.send({'status': false});
    };
  });

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
        mongo.find(
          'users',
          { username: req.body.username },
          {
            fields: {
              username: 1, password: 1
            }
          },
          function (err, result) {
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
                res.send({'login': false, loginError: true});
              }
            } else {
              res.contentType('application/json');
              res.cookie('utype', 0, { maxAge: 1, httpOnly: false });
              res.send({'login': false, loginError: true});
            }
        }); // ENDS func
    }
    // DEBUG
    if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
      console.log('REQ SESSION OBJECT:', req.session);
    }
  });

  app.post('/logout', function(req, res) {
    req.session.destroy(function(err) {
      res.contentType('application/json');
      res.cookie('utype', 0, { maxAge: 1, httpOnly: false });
      res.send({'logout': true});
    });
  });

  app.post('/admin/deletemessage', function(req, res, next) {
    if (isAuthenticated(req, res, next) === true) {
      mongo.deleteOneById('messages', req.body.id, function (status) {
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
  });

  app.post('/admin/editmessage', function(req, res, next) {
    if (isAuthenticated(req, res, next) === true || req.body.uid) {
      let criteriaObject = {};
      if (isAuthenticated(req, res, next) === false) {
        criteriaObject['uid'] = req.body.uid;
      }
      mongo.update({message: req.body.message}, 'messages', req.body.id, criteriaObject, function (status) {
        res.contentType('application/json');
        res.send({
          'edited': status
        });
      });
    } else {
      res.contentType('application/json');
      res.send({
        'edited': false
      });
    }
  });

  // Special cases -->

  // 404
  app.use(function(req, res, next) {
    res.status(404).send('Sorry! Nothing found :(');
  });

  // errors (for example file not found)
  app.use(function(err, req, res, next) {
    res.status(500).send('Something broke! ' + err.stack);
  });

  // Helper functions -->

  function isAuthenticated(req, res, next) {
    if (typeof req.session.user_id !== 'undefined') {
      return true;
    }	else {
      return false;
    }
  }

}); // ENDS load server_config

/* Websocket functionality (for Chat) */
startSocketServer = (httpServer) => {
  let socketServer = new socketserver({
    httpServer: httpServer
  });

  socketServer.on('request', function(request) {
    let acceptConn = request.accept(null, request.origin);
  });

  socketServer.on('connect', function(connection) {
    count++;
    connection.id = count;
    clients[count] = connection;

    mongo.find(
      'messages',
      false,
      {
        fields: {
          message: 1,
          user_name: 1,
          email: 1,
          uid: 1,
          timestamp: 1
          /*, _id: 0*/
        },
        sort: {
          timestamp: -1
        },
        limit: 10
      },
      function (err, results) {
        if (err !== null) {
          connection.sendUTF(JSON.stringify({
            custom: "Sorry! Problems with the database...",
            _id: 'custom_err'
          }));
        } else {
          if (Array.isArray(results) === true && results.length > 0) {
            let firstMessage = [{custom: 'Welcome. Logged in.', _id: 'custom_welcome'}];
            connection.sendUTF(JSON.stringify(results.concat(firstMessage)));
          } else {
            connection.sendUTF(JSON.stringify({custom: 'Welcome. Logged in.', _id: 'custom_welcome'}));
          }
        }
        //console.log("RESULTS", results);
      }
    );

    connection.on('message', function(message) {
      if(mongo)	{
        // 0: message
        // 1: chat name
        // 2: email
        let msg_parts = message.utf8Data.split(';');
        let message_text = msg_parts[0];
        let chat_name = msg_parts[1];
        let email = msg_parts[2];
        let uid = msg_parts[3];

        mongo.insert(
          {
            message: message_text,
            user_name: chat_name,
            email: email,
            uid: uid,
            ip: connection.remoteAddress,
            timestamp: new Date()
          },
          'messages',
          function(status, result) {
            if (result) {
              for(let i in clients)	{
                clients[i].sendUTF(
                  JSON.stringify({
                    message: result.ops[0].message,
                    timestamp: result.ops[0].timestamp,
                    user_name: result.ops[0].user_name,
                    uid: result.ops[0].uid,
                    _id: result.ops[0]._id
                  })
                );
              }
            }
          }
        );

        try {
          let transporter = nodemailer.createTransport({service: 'Gmail', auth: { user: mailConfig.user, pass: mailConfig.pass }});
          transporter.sendMail(
            {
              from: 'chat@petajajarvi.net',
              to: 'aripetaj@gmail.com',
              subject: 'New chat message',
              text: new Date() + ' ' + chat_name + ':\n\n'+ message_text + '\n\nemail: ' + email
            },
            function(error, info) {
              if (error) {
                console.log('MAIL SEND ERROR', error);
              } else {
                //console.log('Message sent: ' + info.response);
              }
            }
          );
        } catch (err) {};
      }
    });

    connection.on('close', function( reasonCode, description ) {
      //console.log('\nCLIENT IDS ACTIVE:\n ');
      for(let i in clients) {
        if(i == connection.id) {
          delete clients[i]; // delete the closed connection object from the client OBJECT LITERAL
        }	else {
          //console.log( i );
        }
      }
      //console.log('connection closed');
    });

  }); // ENDS on connect

  return socketServer;
}

getCurrentTime = (date) => {
  let d = (date ? new Date(date) : new Date());
  let offset = (new Date().getTimezoneOffset() / 60) * -1;
  let n = new Date(d.getTime() + offset);
  let time = n.getDate() + '.' + (n.getMonth() + 1) + '.' + n.getFullYear() + '  '
    + (n.getHours() < 10 ? '0' : '') + n.getHours() + ':' + (n.getMinutes() < 10 ? '0' : '') + n.getMinutes();
  return time;
};


// TODO: refactor for use in future???
/*
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

        for (let i=0; i<items.length; i++) {
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
