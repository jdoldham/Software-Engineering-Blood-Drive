var express = require('express');
var router = express.Router();

/* 
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});

/* 
 * GET user by email.
 */
router.post('/useremail/:email/:pass', function(req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  //var userEmail = req.params.
  console.log("We are Here " + req.params.pass);
  collection.find({'email' : req.params.email, 'password' : req.params.pass},{},function(e,docs){
    console.log(docs);
    res.send((docs.length < 1) ? {msg : false} : {msg : true});
  });
});

var sess;
router.post('/login/:email/:pass', function(req, res) {
  
  var db = req.db;
  var collection = db.get('userlist');
  //var userEmail = req.params.
  //console.log("We are Here " + req.params.pass);
  var success = false;
  collection.find({'email' : req.params.email, 'password' : req.params.pass},{},function(e,docs){
    //console.log(docs);
    res.send((docs.length < 1) ? {msg : false} : {msg : true});
    success = ((docs.length < 1) ? false : true);
    console.log('success');
    console.log(success);
  });
  
  if(success){
    sess = req.session;
    console.log('here');
    sess.email = req.params.email;
    console.log('asdf');
    console.log(sess.email);
    //res.redirect('/temp');
  }
  console.log('fdas');
});

router.post('/testsession', function(req, res) {
  console.log('here');
  console.log(sess.email);
});

router.post('/logout', function(req,res) {
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

/*
 *POST to adduser
 */
router.post('/adduser', function(req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  
  var isNew = true;
  collection.find({'email' : req.body.email},{},function(e,docs){
    if(docs.length < 1) {
      collection.insert(req.body, function(err, result){
        res.send(
          (err === null) ? {msg: '' } : {msg: err}
        );
      });
    } else {
      res.send({msg : 'email already exists'});
    }
  });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  var userToDelete = req.params.id;
  collection.remove({ '_id' : userToDelete }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});
 
module.exports = router;
