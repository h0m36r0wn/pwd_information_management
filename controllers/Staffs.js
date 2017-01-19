'use strict';
var StaffsMdl = require('../models/StaffsMdl');
var idGen = require('id-gen');
var staffIdGen = new idGen({digits:8 , prefix:'STAFF-'});
var async = require('async');
var CONFIG = require('../bin/config');
var request = require('request');
var UsersMdl = require('../models/UsersMdl');
class Staffs {
  constructor(opts) {
    this.first_name = typeof opts !='undefined' && typeof this.first_name !='undefined' ? opts.first_name : null;
    this.last_name = typeof opts !='undefined' && typeof this.last_name !='undefined' ? opts.last_name : null;
    this.barangay = typeof opts !='undefined' && typeof this.barangay !='undefined' ? opts.barangay : null;
    this.full_name = typeof opts !='undefined' && typeof this.full_name !='undefined' ? opts.full_name : null;
    this.staff_id = typeof opts !='undefined' && typeof this.staff_id !='undefined' ? opts.staff_id : null;
    this.staff_uuid = typeof opts !='undefined' && typeof this.staff_uuid !='undefined' ? opts.staff_uuid : null;
    this.user_id = typeof opts !='undefined' && typeof this.user_id !='undefined' ? opts.user_id : null;
    this.mobile_number = typeof opts !='undefined' && typeof this.mobile_number !='undefined' ? opts.mobile_number : null;
    this.password = typeof opts !='undefined' && typeof this.password !='undefined' ? opts.password : null;
  }

  createStaffCustomId(){
    var _self = this;
    var idGenerated = false;
    return new Promise(function(resolve, reject){
      async.whilst(
          function() { return idGenerated == false; },
          function(callback){
            _self.staff_id = staffIdGen.next();
            var query = { staff_id:_self.staff_id };
            StaffsMdl.findOne(query, function(err, staffObj){
              if(err) callback('Unknown error happened while testing pwd id ', null);
              if(staffObj){
                callback(null, idGenerated);
              }else{
                idGenerated = true;
                callback(null, idGenerated);
              }
            })
          },
          function(err, staffId){
            if(err) reject(err);
            if(staffId) resolve(_self.staff_id)
          }
      )
    })
  }
  createStaff(){
    var _self = this;
    return new Promise(function(resolve, reject){
      var staff  = new StaffsMdl();
      staff.first_name = _self.first_name;
      staff.last_name = _self.last_name;
      staff.barangay = _self.barangay;
      staff.user = _self.user_id;
      staff.full_name = _self.full_name;
      staff.staff_id = _self.staff_id;
      staff.mobile_number = _self.mobile_number;
      staff.save(function(err, staffObj){

        if(err) reject('Unknown error happened while creating staff account');
        if(staffObj) resolve(staffObj);
      })
    })
  }

  sendCredentials(message){
    var _self = this;
    return new Promise(function(resolve, reject){
      var requestBody = {"1":_self.mobile_number, "2":message, "3":CONFIG.ITEXTMOKEY };
      request.post(
        CONFIG.SMSURL, { form: requestBody },
        function(err, httpResponse, body){
          console.log(body);
          if(err) reject('Unknown error while sending credentials');
          resolve();
        }
      )
    })
  }
  getStaffList(){
    var _self = this;
    return new Promise(function(resolve, reject) {
      var query = { barangay: { "$ne":"global" } };
      StaffsMdl.find(query, function(err, list){
        if(err) reject('Unknown error happened while getting staff list');
        if(list) resolve(list);
      })
    });
  }

    findStaffById(){
    var _self = this;
    return new Promise(function(resolve, reject) {
      StaffsMdl.findById(_self.staff_uuid)
      .populate('user')
      .exec(function(err, staffInfo){
        if(err) rejetc('Unknown error happened while getting staff info');
        if(staffInfo){
          console.log(staffInfo);
           resolve(staffInfo);
        }else{
          resolve(null);
        }
      })
    });
  }

  updateStaffProfile(){
    var _self = this;

    return new Promise(function(resolve, reject){

      var userQuery = { "_id":_self.user_id }
      var updates = {
        email:_self.email
      }
      if(_self.password != null){
        updates.password = _self.password;
      }
      var opts = { new:true }


      UsersMdl.findOneAndUpdate(userQuery, updates,opts, function(err, isUpdated){
        if(err) reject('Unknown error happened');
        if(isUpdated){
          var staffQuery = {"_id":_self.staff_uuid };
          var staffUpdates = {
            first_name:_self.first_name,
            last_name:_self.last_name,
            barangay:_self.barangay,
            mobile_number:_self.mobile_number,
            full_name:_self.full_name
          }
          StaffsMdl.findOneAndUpdate(staffQuery, staffUpdates, opts, function(staffErr, staffUpdatedInfo){
            console.log(staffUpdatedInfo);
            if(err) reject('Unknown error happened');
            resolve();
          })
        }
      })
    })

  }
}


module.exports = Staffs;
