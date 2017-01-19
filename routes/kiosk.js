var express = require('express');
var router = express.Router();
var CONFIG = require('../bin/config');
var PWD = require('../controllers/Pwd');
var Companion = require('../controllers/Companion');
var User = require('../controllers/Users');
var ImgMdl = require('../models/PwdImageMdl');
var passport = require('../bin/passport');
var Globals = require('../controllers/Globals');

router.route('/')
  .get(function(req, res){
    res.render('pages/kiosk/kiosk', { barangays: CONFIG.BARANGAYS, disabilities:CONFIG.DISABILITIES });
  })
  .post(function(req, res){
    var body = req.body;
    var pwd = new PWD();
    pwd.generatePwdId().then(function(pwdId){
      var user = new User();
      user.email = body.email;
      user.password =pwdId;
      user.role = CONFIG.ROLES.USER;
      user.createUser().then(function(userId){
        pwd.first_name = body.first_name;
        pwd.last_name = body.last_name;
        pwd.disability_type = body.disability;
        pwd.pwd_id = pwdId;
        pwd.barangay = body.barangays;
        pwd.mobile_number = body.mobile_num;
        pwd.full_name = body.first_name+" "+body.last_name;
        pwd.address = body.address;
        pwd.has_companion = body.has_companion;
        pwd.user_id = userId;
        pwd.createPwd().then(function(pwdUuid){
          var img = new ImgMdl;
          img.image_uri = body.pwd_picture;
          img.pwd = pwdUuid;
          img.save();
          if(body.has_companion == "true"){
            var companion = new Companion();
            companion.generateCustomCompId().then(function(compId){
              companion.first_name = body.companion_fname;
              companion.last_name = body.companion_lname;
              companion.companion_id = compId;
              companion.pwd_uuid = pwdUuid;
              companion.relationship = body.relationship;
              companion.mobile_number = body.companion_mobile_num;
              companion.createCompanion().then(function(){
                companion.createCompanion().then(function(){
                  req.flash('createPwd','You have successfully created a pwd account');
                  res.redirect('/pwds');
                })
              })
            })

          }else{
            req.flash('createPwd','You have successfully created a pwd account');
            res.redirect('/pwds');
          }
        })
      })
    })
  })

module.exports = router;
