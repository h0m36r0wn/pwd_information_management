'use strict';
var AnnMdl = require('../models/AnnouncementsMdl');
var mongoose = require('mongoose');
var request = require('request');
var PwdMdl = require('../models/PwdMdl');
var CONFIG = require('../bin/config');
class Globals {
  constructor(opts) {
    this.content = typeof opts !='undefined' && typeof opts.content !='undefined' ? opts.content : null;
    this.title = typeof opts !='undefined' && typeof opts.title !='undefined' ? opts.title : null;
    this.content_type = typeof opts !='undefined' && typeof opts.content_type !='undefined' ? opts.content_type : null;
    this.barangay = typeof opts !='undefined' && typeof opts.barangay !='undefined' ? opts.barangay : null;
    this.created_by = typeof opts !='undefined' && typeof opts.created_by !='undefined' ? opts.created_by : null;
    this.pwd_id = typeof opts !='undefined' && typeof opts.pwd_id !='undefined' ? opts.pwd_id : null;
    this.announcement_id = typeof opts !='undefined' && typeof opts.announcement_id !='undefined' ? opts.announcement_id : null;
  }

  createContent(){
    var _self = this;
    return new Promise(function(resolve, reject) {
      var post = new AnnMdl();
      post.title = _self.title;
      post.content = _self.content;
      post.content_type = _self.content_type;
      post.barangay = _self.barangay;
      post.created_by = mongoose.Types.ObjectId(_self.created_by);
      post.save(function(err, postObj){
        if(err) reject('Unknown error happened while saving post');
        if(postObj) resolve(postObj);
      })
    })
  }
  getAllAnnouncements(){
    return new Promise(function(resolve, reject){
      AnnMdl.find({})
      .sort('-date_created')
      .populate('created_by')
      .exec(function(err, announcements){
        if(err) reject('Unknown error happened while fetching announcements');
        if(announcements) resolve(announcements);
      })
    })
  }

  getAnnouncementsByBarangay(){
    var _self = this;
    return new Promise(function(resolve, reject){
      var query = {"$or":[{barangay:_self.barangay}, { content_type:'global'}] }
      AnnMdl.find(query)
      .sort('-date_created')
      .populate('created_by')
      .exec(function(err, announcements){

        if(err) reject('Unknown error happened while fetching announcements');
        if(announcements) resolve(announcements);
      })
    })
  }

  sendNotifId(){
    var _self = this;
    var query = { "_id":_self.pwd_id };
    PwdMdl.findOne(query, function(err, pwdInfo){
      var message = "Your PWDID is now ready for pickup in your nearest barangay hall";
      var requestBody = {"1":pwdInfo.mobile_number, "2":message, "3":CONFIG.ITEXTMOKEY };
      request.post(
        CONFIG.SMSURL, { form: requestBody },
        function(err, httpResponse, body){
          console.log(body);
        }
      )
    })
  }

  getAllAnnouncementsDetails(){
    var _self = this;
    return new Promise(function(resolve, reject) {
      var query = { "_id":_self.announcement_id };
      AnnMdl.findOne(query)
      .populate('created_by')
      .exec(function(err, annObj){
        if(err) reject("Unknown error happened");
        if(annObj) resolve(annObj);
      })
    });
  }
  updateAnn(){
    var _self = this;
    return new Promise(function(resolve, reject) {
      var query = { "_id":_self.announcement_id };
      var updates = { title:_self.title, content:_self.content, date_created:new Date() }
      var opts = { upsert:false, new:true, safe:true }
      AnnMdl.findOneAndUpdate(query, updates, opts, function(err, isUpdated){
        if(err) reject("Unknown error happened");
        if(isUpdated) resolve(isUpdated);
      })
    });
  }

  deleteAnnoucement(){
    var _self = this;
    return new Promise(function(resolve, reject) {
      var query = { "_id":_self.announcement_id };
      AnnMdl.remove(query, function(err, isDeleted){
        if(err) reject('Unknown error happened');
        if(isDeleted) resolve(isDeleted);
      })
    });
  }
}

module.exports = Globals;
