var express = require('express');
var router = express.Router();
var CONFIG = require('../bin/config');
var passport = require('../bin/passport');
var User = require('../controllers/Users');
var Staffs = require('../controllers/Staffs');
var randomString = require('randomstring');
router.route('/')
  .get(passport.checkAuthentication, function(req, res){
    res.json({message:"hahaha"})
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
          staff.sendCredentials(message, staff.mobile_number).then(function(){
            res.redirect('/staffs');
          })
        })
      },function(err){
        console.log(err);

      })
    })
  })

module.exports = router;
