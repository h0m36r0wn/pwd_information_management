var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pwdModel = new Schema({
    first_name:{
      type:String
    },
    last_name:{
      type:String
    },
    disability_type:{
      type:String
    },
    barangay:{
      type:String
    },
    mobile_number:{
      type:String
    },
    address:{
      type:String
    },
    has_id:{
      type:Boolean
    },
    full_name:{
      type:String
    },
    has_companion:{
      type:Boolean,
      default:false
    },
    user:{
      type:Schema.Types.ObjectId,
      refs:'Users'
    },
    pwd_id:{
      type:String
    }
})

module.exports = mongoose.model('Pwds',pwdModel);
