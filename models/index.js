var fs = require('fs');
var CONFIG = require('../bin/config');
fs.readdirSync(__dirname).forEach(function(file){
  if(CONFIG.INDEX_PAGE){
    var modelName = file.split('.')[0];
    exports[modelName] = require('./'+modelName);
  }
})
