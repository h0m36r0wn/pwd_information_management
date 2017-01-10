'use strict';

var RequestsMdl = require('../models/RequestsMdl');
var idGen = require('id-gen');
var reqId = new idGen({digits:8 , prefix:'REQ-'});
var async = require('async');
class Requests {
  constructor(opts) {
    this.title = typeof opts !='undefined' && typeof opts.title !='undefined' ? opts.title : null;
    this.request_content = typeof opts !='undefined' && typeof opts.request !='undefined' ? opts.request : null;
    this.requested_by = typeof opts !='undefined' && typeof opts.requested_by !='undefined' ? opts.requested_by : null;
    this.request_id = typeof opts !='undefined' && typeof opts.request_id !='undefined' ? opts.request_id : null;
    this.request_uiid = typeof opts !='undefined' && typeof opts.request_uiid !='undefined' ? opts.request_uiid : null;
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
          console.log(genReqId);
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
      requestObj.request = _self.content;
      requestObj.request_id = _self.request_id;
      requestObj.save(function(err, reqObj){
        if(err) reject('Unknown error happened while submiting request');
        if(reqObj) resolve(reqObj);
      })
    })
  }

}

module.exports = Requests;
