var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var Promise = require('bluebird');

var db = require('../app/config');
var users = require('../app/config').users;
var links = require('../app/config').links;

// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  console.log('routed to renderIndex----------------- ');
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  var data = links.find();
  res.status(200).send(data);
  // links.find({url: url}, function(err, result) {
  //   console.log(err);
  //   console.log(result);
  // });
  // res.status(200).send(db.links.find({url: url}));
  // Links.reset().fetch().then(function(links) {
  //   res.status(200).send(links.models);
  // });
};

exports.saveLink = function(req, res) {


  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }
  
  links.find({url: uri}, function(err, data) {
    if (data.length === 0) {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var newLink = new links ({
          url: uri,
          title: title,
          baseUrl: req.headers.host
        });
        
        newLink.save(function(err) {
          if (err) {
            console.log('Not saved to DB', err);
          }
          res.status(200).send(newLink);
        });
      });
    } else {
      res.status(200).send(data[0]);
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       });
  //     }
  //   });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  users.findOne({username: username}).exec(function(err, user) {
    if (!user) {
      var newUser = new users({
        username: username,
        password: password
      });
      newUser.save(function(err, newU) {
        util.createSession(req, res, newU);
      });
    } else {
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  links.find({code: req.params[0]}, function(err, data) {
    if (data.length === 0) {
      res.redirect('/');
    } else {
      res.redirect(data[0].url);
    }
  });

  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};