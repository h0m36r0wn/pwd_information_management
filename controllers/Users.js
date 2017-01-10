'use strict';
var UserMdl = require('../models/UsersMdl');
var PwdMdl = require('../models/PwdMdl');
var CompanionMdl = require('../models/CompanionMdl');
var CONFIG = require('../bin/config');
var StaffsMdl = require('../models/StaffsMdl');
class Users {
  constructor(opts) {
    this.password = typeof opts !='undefined' && typeof opts.password !='undefined' ? this.password : null;
    this.role = typeof opts !='undefined' && typeof opts.role !='undefined' ? this.role : null;
    this.email = typeof opts !='undefined' && typeof opts.email !='undefined' ? this.email : null;
    this.user_id = typeof opts !='undefined' && typeof opts.user_id !='undefined' ? opts.user_id : null;
    this.role = typeof opts !='undefined' && typeof opts.role !='undefined' ? opts.role : null;
  }


  createUser(){
    var _self = this;
    return new Promise(function(resolve, reject){
      var user =  new UserMdl();
      user.email = _self.email;
      user.password = _self.password;
      user.role = _self.role;
      user.save(function(err, user){
        if(err) reject('Unknown error happened while saving user');
        if(user) resolve(user._id);
      })
    })
  }

  getProfile(){
    var _self = this;
    return new Promise(function(resolve, reject){
      if(_self.user_id != null){
        var query = { user:_self.user_id };
        PwdMdl.findOne(query, function(err, pwdObj){
            if(err) reject('Unknown error happened while getting profile');
            if(pwdObj){
              if(pwdObj.has_companion){
                var q = { pwd_uuid:pwdObj._id };
                CompanionMdl.findOne(q, function(err, companionObj){
                  if(err) reject('Unknown error happened while getting profile');
                  if(companionObj){
                    var profileObj = {
                      pwd_info:pwdObj,
                      companion_info:companionObj
                    }
                    resolve(profileObj);
                  }else{
                    resolve(null);
                  }
                })
              }else{
                var profileObj = {
                  pwd_info:pwdObj
                }
                resolve(profileObj);
              }
            }else{
              reject('No Profile found')
            }
        })
      }
    })
  }
  getStaffProfile(){
    var _self = this;
    return new Promise(function(resolve, reject){
        var query = { user:_self.user_id };
        StaffsMdl.findOne(query, function(err, staffObj){
          if(err) reject('Unknown error happened while getting staff profile');
          if(staffObj){
            var staffProfileObj = {
              staff_info:staffObj
            }
            resolve(staffProfileObj);
          }
        })
    })
  }


  checkIfHasAdminAccount(){
    var _self = this;
    return new Promise(function(resolve, reject){
        UserMdl.findOne({email:CONFIG.ADMIN_ACC}, function(err, admin){
          if(err) reject('Unknown error occured while checking admin account');
          if(admin == null){
            resolve(false);
          }else{
            resolve(true);
          }
        })
    })
  }

  createAdminAcc(){
    var user = new UserMdl();
    user.email = CONFIG.ADMIN_ACC;
    user.password = CONFIG.DEFAULT_PASS;
    user.role = CONFIG.ROLES.ADMIN;
    user.save(function(err, userObj){
      if(userObj){
        var staff = new StaffsMdl();
        staff.first_name = "System",
        staff.last_name = "Admin",
        staff.full_name = "System Admin";
        staff.user = userObj._id;
        staff.save();
      }
    })
  }

}

module.exports = Users;
