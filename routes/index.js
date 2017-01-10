var fs = require('fs');
var CONFIG = require('../bin/config');

fs.readdirSync(__dirname).forEach(function(file){
    if(file !=CONFIG.INDEX_PAGE && file!= CONFIG.HOME_PAGE){
      var moduleName = file.split('.')[0];
      exports[moduleName] = require('./'+moduleName);
    }
})
