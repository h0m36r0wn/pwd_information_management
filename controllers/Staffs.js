'use strict';
var StaffsMdl = require('../models/StaffsMdl');
var idGen = require('id-gen');
var staffIdGen = new idGen({digits:8 , prefix:'STAFF-'});
var async = require('async');
var CONFIG = require('../bin/config');
var request = require('request');
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
}


module.exports = Staffs;
