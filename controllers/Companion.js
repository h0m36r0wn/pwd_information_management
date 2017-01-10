'use strict';
var CompanionMdl = require('../models/CompanionMdl');
var idGen = require('id-gen');
var companionIdGen = new idGen({digits:8 , prefix:'COM-'});
var async = require('async');
class Companions {
  constructor(opts) {
    this.first_name = typeof opts !='undefined' && typeof opts.first_name !='undefined' ?  opts.first_name : null;
    this.last_name = typeof opts !='undefined' && typeof opts.last_name !='undefined' ?  opts.last_name : null;
    this.pwd_uuid = typeof opts !='undefined' && typeof opts.pwd_uuid !='undefined' ? opts.pwd_uuid : null;
    this.companion_id = typeof opts !='undefined' && typeof opts.companion_id !='undefined' ? opts.companion_id : null;
    this.mobile_number = typeof opts !='undefined' && typeof opts.mobile_number !='undefined' ? opts.mobile_number  : null;
    this.relationship = typeof opts !='undefined' && typeof opts.relationship !='undefined' ? opts.relationship  : null;
  }


  generateCustomCompId(){
    var _self = this;
    var idGenerated = false;
    return new Promise(function(resolve, reject){
      async.whilst(
        function(){ return idGenerated == false; },
        function(callback){
          _self.companion_id = companionIdGen.next();
          var query = { companion_id:_self.companion_id }
          CompanionMdl.findOne(query, function(err, compObj){
            if(err) callback('Unknown error happened while finding companion id', null);
            if(compObj == null){
              idGenerated = true;
              callback(null, _self.companion_id)
            }
          })
        },
        function(err, compId){
          if(err) reject(err);
          if(compId) resolve(compId);
        }
      )
    })
  }

  createCompanion(){
    var _self = this;
    return new Promise(function(resolve, reject){
      var companion = new CompanionMdl();
      companion.first_name = _self.first_name;
      companion.last_name = _self.last_name;
      companion.pwd_uuid = _self.pwd_uuid;
      companion.companion_id = _self.companion_id;
      companion.mobile_number = _self.mobile_number;
      companion.relationship = _self.relationship;
      companion.save(function(err, companionObj){
        if(err) reject('Unknown error happened while saving companion');
        if(companionObj) resolve(companionObj._id);
      })
    })
  }
}

module.exports = Companions;
