var express = require('express');
var router = express.Router();

/* 
 * GET calendar.
 */
router.get('/calendarlist', function(req, res) {
  var db = req.db;
  var collection = db.get('calendarlist');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});

/*
 *POST to addcalendar
 */
router.post('/addcalendar', function(req, res) {
  var db = req.db;
  var collection = db.get('calendarlist');
  collection.insert(req.body, function(err, result){
    res.send(
      (err === null) ? {msg: '' } : {msg: err}
    );
  });
});

/*
 * DELETE to deletecalendar
 */
router.delete('/deletecalendar/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('calendarlist');
  var userToDelete = req.params.id;
  collection.remove({ '_id' : userToDelete }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});

module.exports = router;
