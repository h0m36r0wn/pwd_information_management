var express = require('express');
var router = express.Router();
var passport = require('../bin/passport');
var passport = require('../bin/passport');
var StaffsMdl = require('../models/StaffsMdl');
var AnnMdl = require('../models/AnnouncementsMdl');
router.route('/')
  .get(passport.checkAuthentication, function(req, res){
    AnnMdl.find({})
    .populate('created_by')
    .exec(function(err, contents){
      console.log(contents);
    })
    res.render('pages/dashboard/dashboard', { info:req.user });
  })


module.exports = router;
