const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

function database() {
  // Connection URL
  const url = 'mongodb://admin:MO_mieite8411@localhost:27017';
  this.db;
  this.collection;

  MongoClient.connect(url, function(err, mongo) {
    assert.equal(null, err);
    this.db = mongo.db('admin');
    this.collection = this.db.collection('messages');
    console.log("Connected successfully to mongodb-server");
    //client.close();
  }.bind(this));
};

database.prototype.find = function(criteria, options, callback) {
  // TODO criteria etc
  if (typeof criteria === undefined || criteria === false) {
    criteria = {};
  }
  if (typeof options === undefined || options === false) {
    options = {};
  }

  this.collection.find(criteria, options, function(err, cursor) {
    assert.equal(null, err);
    cursor.toArray(callback);
  });
}

database.prototype.insert = function(data) {
  this.collection.insert(data, function(err, result) {
      assert.equal(err, null);
      assert.equal(1, result.insertedCount);
      //console.log("DB Insert successful", result);
  }.bind(this));
  // collection.insertMany([}...
}

module.exports = database;
