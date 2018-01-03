const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://admin:MO_mieite8411@localhost:27017';
var db;

MongoClient.connect(url, function(err, database) {
  assert.equal(null, err);
  db = database.db('admin');
  console.log("Connected successfully to mongodb-server");

  //client.close();
});

var insert = function(data) {
  // Get the messages collection
  const collection = db.collection('messages');
  collection.insertMany([
    {
      "message" : data.message,
      "user_name": data.user_name,
      "email": data.email,
      "ip":  data.ip,
      "date": data.timestamp
    }
  ], function(err, result) {
      console.log("DB Insert successful");
  //  assert.equal(err, null);
  //  assert.equal(3, result.result.n);
  //  assert.equal(3, result.ops.length);
  //  callback(result);
  });
}

module.exports.insert = insert;




// LEGACY -->
/*var mysql = require("mysql");

var mysql_con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "PE_mieite8411",
	  database: "nodejs_chat"
});

mysql_con.connect( function( err ) {
  if( err )
  {
	console.log('Error connecting to DB');
	return;
  }
  console.log('DB Connection established');
});

this.query = function(sql, callback)
{
	//console.log("SQL: " +sql);
	mysql_con.query( sql, callback);
}

this.escape = function( s )
{
	//console.log("VALUE: " +mysql_con.escape( s ) );
	return mysql_con.escape( s );
}
*/
