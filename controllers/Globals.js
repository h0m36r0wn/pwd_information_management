'use strict';
var AnnMdl = require('../models/AnnouncementsMdl');
var mongoose = require('mongoose');
class Globals {
  constructor(opts) {
    this.content = typeof opts !='undefined' && typeof opts.content !='undefined' ? opts.content : null;
    this.title = typeof opts !='undefined' && typeof opts.title !='undefined' ? opts.title : null;
    this.content_type = typeof opts !='undefined' && typeof opts.content_type !='undefined' ? opts.content_type : null;
    this.barangay = typeof opts !='undefined' && typeof opts.barangay !='undefined' ? opts.barangay : null;
    this.created_by = typeof opts !='undefined' && typeof opts.created_by !='undefined' ? opts.created_by : null;
  }

  createContent(){
    var _self = this;
    return new Promise(function(resolve, reject) {
      console.log(mongoose.Types.ObjectId(_self.created_by));
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
      console.log(query);
      AnnMdl.find(query)
      .sort('-date_created')
      .populate('created_by')
      .exec(function(err, announcements){
        console.log(err);
        console.log(announcements);
        if(err) reject('Unknown error happened while fetching announcements');
        if(announcements) resolve(announcements);
      })
    })
  }
}

module.exports = Globals;
