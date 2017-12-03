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
