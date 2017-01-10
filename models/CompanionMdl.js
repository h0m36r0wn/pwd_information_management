var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

var companionModel = new Schema({
  first_name:{
    type:String
  },
  last_name:{
    type:String
  },
  mobile_number:{
    type:String
  },
  companion_id:{
    type:String
  },
  relationship:{
    type:String
  },
  pwd_uuid:{
    type:Schema.Types.ObjectId,
    refs:'Pwds'
  }
})

module.exports = mongoose.model('Companions',companionModel);
