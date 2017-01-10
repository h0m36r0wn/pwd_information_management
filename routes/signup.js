var express = require('express');
var router = express.Router();
var CONFIG = require('../bin/config');
var PWD = require('../controllers/Pwd');
var Companion = require('../controllers/Companion');
var User = require('../controllers/Users');


router.route('/')
  .get(function(req, res){
    res.render('pages/signup/signup',{ barangays: CONFIG.BARANGAYS, disabilities:CONFIG.DISABILITIES });
  })

  .post(function(req, res){
    var body = req.body;

    if(body != null){

      var pwd = new PWD();
      pwd.generatePwdId().then(function(pwdId){
        var user = new User();
        user.email = body.email;
        user.password = body.password;
        user.role = CONFIG.ROLES.USER;
        user.createUser().then(function(userId){
          pwd.first_name = body.first_name;
          pwd.last_name = body.last_name;
          pwd.disability_type = body.disability;
          pwd.pwd_id = pwdId;
          pwd.barangay = body.barangays;
          pwd.mobile_number = body.mobile_num;
          pwd.address = body.address;
          pwd.user_id = userId;
          pwd.has_companion = body.has_companion;
          pwd.createPwd().then(function(pwdUuid){
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
                  req.flash('signUpSuccess','You have successfully registered you can now log in in the system');
                  res.redirect('/login');
                })
              })

            }else{
              req.flash('signUpSuccess','You have successfully registered you can now log in in the system');
              res.redirect('/login');
            }
          })
        })
      })
    }
  })


module.exports = router;
