'use strict';
var RequestsMdl = require('../models/RequestsMdl');
var idGen = require('id-gen');
var reqId = new idGen({digits:8 , prefix:'REQ-'});
var async = require('async');
var CONFIG = require('../bin/config');
var request = require('request');

class Requests {
  constructor(opts) {
    this.title = typeof opts !='undefined' && typeof opts.title !='undefined' ? opts.title : null;
    this.request_content = typeof opts !='undefined' && typeof opts.request_content !='undefined' ? opts.request_content : null;
    this.requested_by = typeof opts !='undefined' && typeof opts.requested_by !='undefined' ? opts.requested_by : null;
    this.request_id = typeof opts !='undefined' && typeof opts.request_id !='undefined' ? opts.request_id : null;
    this.request_uiid = typeof opts !='undefined' && typeof opts.request_uiid !='undefined' ? opts.request_uiid : null;
    this.barangay = typeof opts !='undefined' && typeof opts.request_uiid !='undefined' ? opts.barangay : null;
    this.request_uuid = typeof opts !='undefined' && typeof opts.request_uuid !='undefined' ? opts.request_uuid : null;
    this.pwd_id = typeof opts !='undefined' && typeof opts.pwd_id !='undefined' ? opts.pwd_id : null;
    this.mobile_number = typeof opts !='undefined' && typeof opts.mobile_number !='undefined' ? opts.mobile_number : null;
    this.message = typeof opts !='undefined' && typeof opts.message !='undefined' ? opts.message : null;
  }


  createCustomId(){
    var _self = this;
    return new Promise(function(resolve, reject){
      var idGenerated = false;
      async.whilst(
        function(){ return idGenerated == false; },
        function(callback){
          _self.request_id = reqId.next();
          var query = { request_id:   _self.request_id  };
          RequestsMdl.findOne(query, function(err, reqObj){
            if(err)   callback('Unknown error happened while testing request id ', null);
            if(reqObj){
               callback(null, idGenerated);
            }else{
              idGenerated = true;
              callback(null, idGenerated);
            }
          })
        },
        function(err, genReqId){
          if(err) reject(err);
          if(genReqId) resolve(_self.request_id);
        }
      )
    })
  }

  createRequest(){
    var _self = this;
    return new Promise(function(resolve, reject){
      var requestObj = new RequestsMdl;
      requestObj.title = _self.title;
      requestObj.request = _self.request_content;
      requestObj.request_id = _self.request_id;
      requestObj.requestedBy = _self.requested_by;
      requestObj.save(function(err, reqObj){
        if(err) reject('Unknown error happened while submiting request');
        if(reqObj) resolve(reqObj);
      })
    })
  }

  getMyRequests(){
    var _self = this;
    return new Promise(function(resolve, reject){
      var query = { requestedBy:_self.requested_by };
      RequestsMdl.find(query)
      .sort('request_id')
      .exec(function(err, requests){
        if(err) reject("Unknown error happened while fetching requests");
        if(requests) resolve(requests);
      })
    })
  }

    getRequestsByBarangay(){
    var _self = this;
    return new Promise(function(resolve, reject) {
      var query = { isDeclined:false, isReviewed:false, isGranted:false };
      RequestsMdl.find(query)
      .populate('requestedBy')
      .sort('-date_created')
      .exec(function(err, requests){
        if(err) reject('Unknown error happened while getting requests');
        if(requests){
          if(requests.length > 0 ){
            requests.map(function(item,ind){
              if(item.requestedBy.barangay != _self.barangay){
                requests.splice(ind,1);
              }
            })
            resolve(requests);
          }else{
            resolve(requests);
          }
        }
      })
    });
  }
  getAllRequests(){
    var _self = this;
    return new Promise(function(resolve, reject) {
      var query = { isGranted:false, isReviewed:true }
      RequestsMdl.find(query)
      .populate('requestedBy')
      .sort('-date_created')
      .exec(function(err, requests){
        if(err) reject('Unknown error happened while getting requests');
        if(requests) resolve(requests);
      })
    });
  }

  getRequestInfo(){
    var _self = this;
    return new Promise(function(resolve, reject) {
      var query = { "_id":_self.request_uuid };
      RequestsMdl.findOne(query, function(err, reqInfo){
          if(err) reject('Unknown error happened');
          if(reqInfo) resolve(reqInfo);
      })
    });
  }

  grantRequest(){
    var _self = this;
    return new Promise(function(resolve, reject) {
      var query = {"_id":_self.request_uuid };
      var updates = { isGranted:true };
      var opts = { safe:true, upsert:false, new:true };
      RequestsMdl.findOneAndUpdate(query, updates, opts, function(err, isGranted){
        if(err) reject('Unknown error happened');
        if(isGranted) resolve();
      })
    });
  }
  reviewedRequest(){
    var _self = this;
    return new Promise(function(resolve, reject) {
      var query = {"_id":_self.request_uuid };
      var updates = { isReviewed:true };
      var opts = { safe:true, upsert:false, new:true };
      RequestsMdl.findOneAndUpdate(query, updates, opts, function(err, isReviewd){
        if(err) reject('Unknown error happened');
        if(isReviewd) resolve();
      })
    });
  }
  declineRequest(){
    var _self = this;
    return new Promise(function(resolve, reject) {
      var query = { "_id":_self.request_uuid };
      var updates = { isDeclined:true };
      var opts = { safe:true, upsert:false, new:true };
      RequestsMdl.findOneAndUpdate(query, updates, opts, function(err, isReviewd){
        if(err) reject('Unknown error happened');
        if(isReviewd) resolve();
      })
    });
  }
  sendMessage(){
    var _self = this;
    var message = _self.message;
    var requestBody = {"1":_self.mobile_number, "2":message, "3":CONFIG.ITEXTMOKEY };
    request.post(
      CONFIG.SMSURL, { form: requestBody },
      function(err, httpResponse, body){
        console.log(body);
      }
    )
  }

  getMobileNumber(){
    var _self = this;
    return new Promise(function(resolve, reject) {
      var query = {"_id":_self.request_uuid };
      RequestsMdl.findOne(query)
      .populate('requestedBy')
      .exec(function(err, pwdInfo){
        if(err) reject("Unknown error happened");
        if(pwdInfo) resolve(pwdInfo.requestedBy.mobile_number);
      })
    });
  }


}

module.exports = Requests;
