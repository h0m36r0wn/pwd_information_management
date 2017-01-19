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
    isGranted:{
      type:Boolean,
      default:false
    },
    isReviewed:{
      type:Boolean,
      default:false
    },
    isDeclined:{
      type:Boolean,
      default:false
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
