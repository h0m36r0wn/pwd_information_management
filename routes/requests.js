var express = require('express');
var router = express.Router();
var Requests = require('../controllers/Requests');

router.route('/create')
  .get(function(req, res){
    res.render('pages/requests/form');
  })
  .post(function(req, res){
    var body = req.body;
    var requests = new Requests();
    requests.createCustomId().then(function(reqId){
      requests.title = body.title;
      requests.request_content = body.request;
      requests.request_id = reqId;
      //requests.requested_by = req.user._id;
      requests.createRequest().then(function(){
        req.flash('requestSuccess','Your request was successfuly submited');
        res.redirect('/requests');
      },function(err){
        res.flash('requestFailed',err);
        res.redirect('/requests');
      })
    },function(err){
      console.log(err);
    })
  })
module.exports = router;
