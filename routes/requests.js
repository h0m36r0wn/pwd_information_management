var express = require('express');
var router = express.Router();
var Requests = require('../controllers/Requests');
var passport = require('../bin/passport');
var CONFIG = require('../bin/config');

router.route('/')
  .get(passport.checkAuthentication, function(req, res){
    res.render('pages/requests/listings');
  })
router.route('/create')
  .get(passport.checkAuthentication,function(req, res){
    res.render('pages/requests/form');
  })
  .post(passport.checkAuthentication,function(req, res){
    var body = req.body;
    var requests = new Requests();
    requests.createCustomId().then(function(reqId){
      requests.title = body.title;
      requests.request_content = body.request;
      requests.request_id = reqId;
      requests.requested_by = req.user.pwd_info._id;
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

router.route('/request_listing')
  .get(passport.checkAuthentication, function(req,res){
    if(req.user.role == CONFIG.ROLES.USER){
      var requests = new Requests();
      requests.requested_by = req.user.pwd_info._id;
      requests.getMyRequests().then(function(requests){
        res.json(requests);
      },function(err){
        res.status(500);
        res.json([]);
      })
    }else if(req.user.role == CONFIG.ROLES.BRGYSTAFF){
      var requests = new Requests();
      requests.barangay = req.user.staff_info.barangay;
      requests.getRequestsByBarangay().then(function(requests){
          res.json(requests);
      },function(err){
        res.status(500);
        res.json([]);
      })
    }else if(req.user.role == CONFIG.ROLES.ADMIN){
        var requests = new Requests();
        requests.getAllRequests().then(function(requests){
          if(requests) res.json(requests);
        },function(err){
          res.status(500);
          res.json([]);
        })
    }
  })

router.route('/details/:requestId')
  .get(passport.checkAuthentication, function(req, res){
    var requests = new Requests();
    requests.request_uuid = req.params.requestId;
    requests.getRequestInfo().then(function(reqInfo){
        res.render('pages/requests/request_info', { reqInfo:reqInfo });
    })
  })
  .post(passport.checkAuthentication, function(req, res){
    if(req.body.action == "grant" && req.user.role == CONFIG.ROLES.ADMIN){
     var requests = new Requests();
      requests.request_uuid = req.body.request_id;
      requests.grantRequest().then(function(){
        requests.getMobileNumber().then(function(mobileNumber){
          requests.mobile_number = mobileNumber;
          requests.message = "Your request has been granted.It may be available in your barangay after a week from this date";
          requests.sendMessage();
        })
        res.json({granted:true});
      },function(err){
        res.status(500);
        res.json({granted:false});
      })
    }
    if(req.body.action == "reviewed" && req.user.role == CONFIG.ROLES.BRGYSTAFF){
      var requests = new Requests();
      requests.request_uuid = req.body.request_id;
      requests.reviewedRequest().then(function(){
        requests.getMobileNumber().then(function(mobileNumber){
          requests.mobile_number = mobileNumber;
          requests.message = "Your request has been reviewed and forwared to admin";
          requests.sendMessage();
        })
        res.json({reviewed:true})
      }, function(err) {
        res.status(500);
        res.json(err);
      })
    }
  })
router.route('/decline')
  .post(passport.checkAuthentication, function(req, res){
    var body = req.body;
    var requests = new Requests();
    requests.request_uuid = body.request_id;
    requests.declineRequest().then(function(){
      requests.getMobileNumber().then(function(mobileNumber){
        requests.mobile_number = mobileNumber;
        requests.message = "Your request has been reviewed and forwared to admin";
        requests.sendMessage();
      })
      res.json({declined:true})
    },function(err) {
      res.status(500);
      res.json(err);
    })
  })
module.exports = router;
