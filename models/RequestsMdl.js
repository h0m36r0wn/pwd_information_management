var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

var requestsModel = new Schema({
    title:{
      type:String
    },
    request:{
      type:String
    },
    request_id:{
      type:String
    },
    requestedBy:{
      type:Schema.Types.ObjectId,
      ref:'Pwds'
    },
    date_created:{
      type:Date,
      default:function(){
        return Date.now();
      }
    }
});


module.exports = mongoose.model('Requests',requestsModel);
