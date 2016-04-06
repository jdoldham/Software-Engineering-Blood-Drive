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

router.get('/calendaremail/:email', function(req, res) {
  var db = req.db;
  var collection = db.get('calendarlist');
  collection.find({'patient' : req.params.email},{},function(e,docs){
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

router.post('/claimevent/:id/:email', function(req, res) {
  //console.log(req.params.id);
  //console.log(req.params.email);
  var db = req.db; 
  var collection = db.get('calendarlist');
  var userToUpdate = req.params.id;
  try{
  collection.update({ '_id' : userToUpdate },
    { 
    $set: {'patient': req.params.email} 
    }, 
    function(err) {
  });
  }catch(err){ console.log(err);}
});

module.exports = router;
