'use strict';
var PwdMdl = require('../models/PwdMdl');
var idGen = require('id-gen');
var pwdIdGen = new idGen({digits:8 , prefix:'PWD-'});
var ImgMdl = require('../models/PwdImageMdl');
var CompanionMdl = require('../models/CompanionMdl');
var async = require('async');
class Pwd {
  constructor(opts) {
    this.pwd_id = typeof opts !='undefined' && typeof opts.pwd_id !='undefined' ? opts.pwd_id : null;
    this.first_name = typeof opts !='undefined' && typeof opts.first_name !='undefined' ? opts.first_name : null;
    this.last_name = typeof opts !='undefined' && typeof opts.last_name !='undefined'  ? opts.last_name : null;
    this.disability_type = typeof opts !='undefined' && typeof opts.disability_type !='undefined' ? opts.disability_type  : null;
    this.barangay = typeof opts !='undefined' && typeof opts.barangay !='undefined' ? opts.barangay : null;
    this.mobile_number = typeof opts !='undefined' && typeof opts.mobile_number !='undefined' ? opts.mobile_number: null;
    this.address = typeof opts !='undefined' && typeof opts.address !='undefined' ? opts.address: null;
    this.user_id = typeof opts !='undefined' && typeof opts.user_id !='undefined' ?   opts. user_id : null;
    this.has_companion = typeof opts !='undefined' && typeof opts.has_companion !='undefined' ?   opts.has_companion : null;
    this.full_name = typeof opts !='undefined' && typeof opts.full_name !='undefined' ?   opts. full_name: null;
    this.pwd_uuid = typeof opts !='undefined' && typeof opts.pwd_uuid !='undefined' ?   opts.pwd_uuid: null;

  }


  generatePwdId(c){
    var _self = this;
    var idGenerated = false;

    return new Promise(function(resolve, reject){
      async.whilst(
          function() { return idGenerated == false; },
          function(callback) {
            _self.pwd_id = pwdIdGen.next();
            var query = { pwd_id:_self.pwd_id };
            PwdMdl.findOne(query,function(err, pwdObj){
              if(err){
                callback('Unknown error happened while testing pwd id ', null)
              }
              if(pwdObj){
                callback(null,idGenerated)
              }else{
                idGenerated = true;
                callback(null, idGenerated)
              }
            })
          },
          function (err, pwdId) {
              if(err) reject(err);
              if(pwdId) resolve(_self.pwd_id)
          }
      );
    })
  }
  createPwd(){
    var _self = this;
    return new Promise(function(resolve, reject){
      var pwd = new PwdMdl();
      pwd.first_name = _self.first_name;
      pwd.last_name = _self.last_name;
      pwd.disability_type = _self.disability_type;
      pwd.barangay = _self.barangay;
      pwd.pwd_id = _self.pwd_id;
      pwd.mobile_number = _self.mobile_number;
      pwd.full_name = _self.full_name;
      pwd.address = _self.address;
      pwd.user = _self.user_id;
      pwd.has_companion = _self.has_companion;
      pwd.save(function(err, pwdObj){
        if(err) reject('Unknown error while saving PWD');
        if(pwdObj) resolve(pwdObj._id);
      })
    })
  }

  getPwdInfo(){
    var _self = this;
    return new Promise(function(resolve, reject){
      var query = { "_id":_self.pwd_uuid }
      PwdMdl.findOne(query, function(err, pwdObj){
        if(err) reject('Unknown error happened while getting pwd info');
        if(pwdObj) resolve(pwdObj);
      })
    })
  }

  getImage(){
    var _self = this;
    return new Promise(function(resolve, reject){
      var query = { "pwd":_self.pwd_uuid }
      ImgMdl.findOne(query, function(err, imgObj){
        if(err) reject('Unknown error happened while getting pwd image');
        if(imgObj){
           resolve(imgObj)
        }else{
          resolve(null)
        }
      })
    })
  }

  getPwdByBarangay(){
    var _self = this;
    return new Promise(function(resolve, reject) {
        PwdMdl.find({ barangay:_self.barangay }, function(err, pwds){
          if(err) reject('Unknown error happened while getting list');
          if(pwds) resolve(pwds);
        })
    });
  }
  getAllPwds(){
    var _self = this;
    return new Promise(function(resolve, reject) {
        PwdMdl.find({})
        .sort('-pwd_id')
        .exec(function(err, pwds){
          if(err) reject('Unknown error happened while getting list');
          if(pwds) resolve(pwds);
        })
    });
  }
  getInfo(){
    var _self = this;
    return new Promise(function(resolve, reject){
      var query = {"_id":_self.pwd_uuid };
      console.log(query);
      PwdMdl.findOne(query, function(err, pwdInfo){
        if(err) reject('Unknown error happened while getting info');
        if(pwdInfo){
          if(pwdInfo.has_companion){
            var compQuery = { pwd_uuid:_self.pwd_uuid };
            CompanionMdl.findOne(compQuery, function(err, compInfo){
              if(err) reject('Unknown erro happened while getting info');
              if(compInfo){
                var infoObj = {
                  pwdInfo:pwdInfo,
                  compInfo:compInfo
                }
                resolve(infoObj);
              }else{
                var infoObj = {
                  pwdInfo:pwdInfo,
                  compInfo:null
                }
                resolve(infoObj);
              }
            })
          }else{
            var infoObj = {
              pwdInfo:pwdInfo,
              compInfo:null
            }
            resolve(infoObj);
          }
        }
      })
    })
  }
}

module.exports = Pwd;
