const MongoDB = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fs = require('fs');

function database(db = 'site') {
  fs.readFile('database_config.json', function( err, json ) {
    var config = JSON.parse(json);

    // Connection URL
    const url = 'mongodb://' + config.db_username + ':' + config.db_password + '@' + config.db_domain + ':' + config.db_port;
    this.db;

    MongoClient.connect(url, function(err, mongo) {
      assert.equal(null, err);
      this.db = mongo.db(db);
      var collection = this.db.collection('messages');
      console.log("Connected successfully to mongodb-server");
      //client.close();
    }.bind(this));
  }.bind(this));
};  // ENDS constructor

database.prototype.find = function(collection, criteria, options, callback) {
  var collection = this.db.collection(collection);
  if (typeof criteria === undefined || criteria === false) {
    criteria = {};
  }
  if (typeof options === undefined || options === false) {
    options = {};
  }

  collection.find(criteria, options, function(err, cursor) {
    //assert.equal(null, err);
    if (cursor && callback) {
      cursor.toArray(callback);
    }
  });
}  // ENDS find

database.prototype.insert = function(data, collection, callback) {
  var collection = this.db.collection(collection);
  collection.insert(data, function(err, result) {
      //assert.equal(err, null);
      //assert.equal(1, result.insertedCount);
      if (typeof callback !== 'undefined') {
        if (err === null && result && result.insertedCount > 0) {
          callback(true, result);
        } else {
          callback(false);
        }
      }
  }.bind(this));
} // ENDS insert

database.prototype.deleteOneById = function(collection, criteria, callback) {
  var collection = this.db.collection(collection);
  collection.deleteOne({_id: MongoDB.ObjectId(criteria._id)},
    function(err, result) {
      if (typeof callback !== 'undefined') {
        if(err !== null || result.deletedCount !== 1) {
          callback(false);
        } else {
          callback(true);
        }
      }
    });
} // ENDS deleteOne

module.exports = database;
