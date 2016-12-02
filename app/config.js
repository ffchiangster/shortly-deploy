// var mongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var crypto = require('crypto');
var Promise = require('bluebird');
var bcrypt = require('bcrypt-nodejs');
var url = 'mongodb://localhost:27017/db'; // what is 'test'?
mongoose.connect(url);
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: {type: Date, default: Date.now }

});

userSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });  
});

var urlsSchema = new Schema({
  url: { type: String },
  baseUrl: { type: String },
  code: { type: String },
  title: { type: String },
  visits: {type: Number },
  date: {type: Date, default: Date.now }
});

urlsSchema.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});

var Users = mongoose.model('Users', userSchema);
var Links = mongoose.model('Links', urlsSchema);

module.exports.users = Users;
module.exports.links = Links;
module.exports.db = mongoose;


// mongoClient.connect(url, function(err, db) {
//   console.log('created connection');
//   db.createCollection('urls', function(err, collection) {
//     console.log('created collection urls');
//   });

//   db.createCollection('users', function(err, collection) {
//     console.log('created collection urls');
//   }); 

// });

// module.exports = mongoClient;





// var path = require('path');
// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   },
//   useNullAsDefault: true
// });
// var db = require('bookshelf')(knex);

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// module.exports = mongoClient;
