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
  .get(passport.checkAuthentication, function(req, res){
    res.render('pages/pwds/pwd_list');
  })
router.route('/create_account')
  .get(passport.checkAuthentication ,function(req, res){
    if(req.user.role == CONFIG.ROLES.BRGYSTAFF){
      for(var i in CONFIG.BARANGAYS){
        if(i != req.user.staff_info.barangay){
           delete CONFIG.BARANGAYS[i];
        }
      }
    }
    res.render('pages/pwds/create_profile',{ barangays: CONFIG.BARANGAYS, disabilities:CONFIG.DISABILITIES });
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


router.route('/create_id/:pwdid')
  .get(passport.checkAuthentication,function(req, res){
    var pwdId = req.params.pwdid;
    var pwd = new PWD();
    pwd.pwd_uuid = pwdId;
    pwd.getPwdInfo().then(function(pwdObj){
      pwd.getImage().then(function(img){
        if(img == null){
          res.redirect('/pwds/take_picture/'+pwdId);
        }
        var barangay = CONFIG.BARANGAYS[pwdObj.barangay];
        var disability = CONFIG.DISABILITIES[pwdObj.disability_type];
        res.render('pages/pwds/create_id',{
          info:pwdObj,
          barangay:barangay,
          disability:disability,
          pwdImage:img.image_uri
        });

      })
    },function(error){
      //console.log(error);
    })

  })

router.route('/take_picture/:pwdId')
  .get(passport.checkAuthentication, function(req, res){
    var pwdId = req.params.pwdId;
    res.render('pages/pwds/take_picture', { pwdId:pwdId });
  })
  .post(passport.checkAuthentication, function(req, res){
    var img = new ImgMdl();
    var query = { pwd:req.body.pwdId };
    var updates = { image_uri:req.body.pwd_picture };
    var opts = { upsert:true, new:true, safe:true };
    ImgMdl.findOneAndUpdate(query,updates, opts ,function(err, isUpdated){
      console.log(isUpdated);
      res.redirect('/pwds/create_id/'+req.body.pwdId);
    })

  })
router.route('/pwd_list')
  .get(passport.checkAuthentication, function(req, res){
    if(req.xhr){
      if(req.user.role == CONFIG.ROLES.BRGYSTAFF){
        var pwds = new PWD({ barangay:req.user.staff_info.barangay});
        pwds.getPwdByBarangay().then(function(pwsdObj){
          res.json(pwsdObj);
        })
      }else if(req.user.role == CONFIG.ROLES.ADMIN){
        var pwds = new PWD();
        pwds.getAllPwds().then(function(pwsdObj){
          res.json(pwsdObj);
        })
      }
    }
  })
router.route('/profile/:pwd_id')
  .get(passport.checkAuthentication,function(req, res){

     var pwd_id = req.params.pwd_id;
     var pwds = new PWD({pwd_uuid:pwd_id});
     var info = {};
     pwds.getInfo().then(function(pwdInfo){
       info = pwdInfo;
       res.render('pages/pwds/pwd_info', {info:info, barangay:CONFIG.BARANGAYS[info.pwdInfo.barangay], disability:CONFIG.DISABILITIES[info.pwdInfo.disability_type]});
     })

  })
  router.route('/my_profile')
    .get(passport.checkAuthentication,function(req, res){

       var pwd_id = req.user.pwd_info._id;
       var pwds = new PWD({pwd_uuid:pwd_id});
       var info = {};
       pwds.getInfo().then(function(pwdInfo){
         info = pwdInfo;
         res.render('pages/pwds/my_profile', {info:info, barangay:CONFIG.BARANGAYS[info.pwdInfo.barangay], disability:CONFIG.DISABILITIES[info.pwdInfo.disability_type]});
       })

    })

router.route('/notify_id')
  .post(function(req, res){
    if(req.body.print == 'done'){
      var globals = new Globals();
      globals.pwd_id = req.body.pwdId;
      globals.sendNotifId();
    }
  })
module.exports = router;
