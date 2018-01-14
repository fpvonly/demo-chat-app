const MongoDB = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

function database() {
  // Connection URL
  const url = 'mongodb://admin:MO_mieite8411@localhost:27017';
  this.db;
  this.collection;
  //TODO to private

  MongoClient.connect(url, function(err, mongo) {
    assert.equal(null, err);
    this.db = mongo.db('admin');
    this.collection = this.db.collection('messages');
    console.log("Connected successfully to mongodb-server");
    //client.close();
  }.bind(this));
};

database.prototype.find = function(collection, criteria, options, callback) {
  this.collection = this.db.collection(collection);
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

database.prototype.insert = function(data, collection, callback) {
  this.collection = this.db.collection(collection);
  this.collection.insert(data, function(err, result) {
      assert.equal(err, null);
      assert.equal(1, result.insertedCount);
      if (typeof callback !== 'undefined') {
        if (err === null) {
          callback(true, result);
        } else {
          callback(false);
        }
      }
      //console.log("DB Insert successful", result);
  }.bind(this));
  // collection.insertMany([}..
}

database.prototype.remove = function(collection, criteria, callback) {
  this.collection = this.db.collection(collection);

   this.collection.deleteOne({_id: criteria.id},
    function(err, result) {
      console.log('REMOVE ', err, {'_id': new MongoDB.ObjectId(criteria.id)}, result);

      if (typeof callback !== 'undefined') {
        if(err !== null) {
          callback(false);
        } else {
          callback(true);
        }
      }
    });
}

module.exports = database;
