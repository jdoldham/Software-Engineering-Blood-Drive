var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'Hello, World!' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{},function(e,docs){
    res.render('userlist', {
      "userlist" : docs
    });
  });
});

/* GET Calendartest page. */
router.get('/calendartest', function(req, res) {
  res.render('calendartest', { title: 'Calendar' });
});

/* GET Calendarlist page. */
router.get('/calendarlist', function(req, res) {
  var db = req.db;
  var collection = db.get('calendarlist');
  collection.find({},{},function(e,docs){
    res.render('calendarlist', {
      "calendarlist" : docs
    });
  });
});

module.exports = router;
