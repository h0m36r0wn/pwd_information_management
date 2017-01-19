var express = require('express');
var router = express.Router();
var CONFIG = require('../bin/config');
var passport = require('../bin/passport');
var User = require('../controllers/Users');
var Staffs = require('../controllers/Staffs');
var randomString = require('randomstring');
var bcryptjs = require('bcryptjs');

router.route('/')
  .get(passport.checkAuthentication, function(req, res){
    res.render('pages/staffs/staff_list')
  })

router.route('/create')
  .get(passport.checkAuthentication, function(req, res){
    res.render('pages/staffs/form',{ barangays: CONFIG.BARANGAYS });
  })
  .post(passport.checkAuthentication, function(req, res){
    var body = req.body;
    var user = new User
    var password = randomString.generate(8);
    user.email = body.email;
    user.password = password
    user.role = CONFIG.ROLES.BRGYSTAFF;
    user.createUser().then(function(userId){

      var staff = new Staffs();
      staff.createStaffCustomId().then(function(staffId){
        staff.first_name = body.first_name;
        staff.last_name = body.last_name;
        staff.full_name = body.first_name+" "+body.last_name;
        staff.mobile_number = body.mobile_number;
        staff.staff_id = staffId;
        staff.barangay = body.barangay;
        staff.user_id = userId;
        staff.createStaff().then(function(){
          var message = "email:"+body.email+" password: "+password;
          staff.sendCredentials(message, staff.mobile_number);
          res.redirect('/staffs');
        })
      },function(err){
        console.log(err);
      })
    })
  })

router.route('/listing')
  .get(passport.checkAuthentication, function(req, res){
    if(req.xhr){
      var staff = new Staffs();
      staff.getStaffList().then(function(list){
        res.json(list)
      },function(err){
        res.status(500);
        res.json([]);
      })
    }
  })

router.route('/edit/:staffUiid')
  .get(passport.checkAuthentication, function(req, res){
    if(typeof req.params.staffUiid !='undefined'){
      var staff = new Staffs();
      staff.staff_uuid = req.params.staffUiid;
      staff.findStaffById().then(function(staffInfo){
        if(staffInfo != null){
          res.render('pages/staffs/edit_staff_info', { barangays: CONFIG.BARANGAYS , staffInfo:staffInfo })
        }
      },function(err){
        res.redirect('/announcements');
      })
    }
  })
  .post(passport.checkAuthentication, function(req, res){
    var body = req.body;
    var staff = new Staffs();
    staff.first_name = body.first_name;
    staff.barangay = body.barangay;
    staff.last_name = body.last_name;
    staff.mobile_number = body.mobile_number;
    staff.email = body.email;
    staff.full_name = body.first_name+" "+body.last_name;
    staff.staff_uuid = req.params.staffUiid;
    staff.user_id  = body.user_id;
    if(body.password.length > 0){
      console.log('has password');
      bcryptjs.genSalt(10, function(err, salt){
        bcryptjs.hash(body.password, salt, function(err, hashedPass){
            staff.password = hashedPass;
            staff.updateStaffProfile().then(function(){
              req.flash('profileUpdated','Staff profile successfully updated');
              res.redirect('/staffs');
            },function(err){
              req.flash('updateFail','Staff profile update failed');
              res.redirect('/staffs');
            })
        })
      })
    }else{
      staff.updateStaffProfile().then(function(){
        req.flash('profileUpdated','Staff profile successfully updated');
        res.redirect('/staffs');
      },function(err){
        req.flash('updateFail','Staff profile update failed');
        res.redirect('/staffs');
      })
    }


  })
module.exports = router;
