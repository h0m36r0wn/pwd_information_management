$(document).ready(function(){
  login.init();
})

var login = (function(){
  var init = function(){
    if (typeof message !='undefined') {
      showAlert(message);
    }
    if(typeof signUpSuccess !='undefined'){
      showSuccess(signUpSuccess);
    }
  }

  var showAlert = function(message){
    var n =   noty({
        text:message || 'Unknown error happened',
        layout:'top',
        speed:500,
        type:'error',
        closeWith:['click'],
        theme:'relax',
        animation   : {
            open  : 'animated fadeInDown',
            close : 'animated fadeOutRight',
            speed : 100
        }
      });
      return n;
  }
  var showSuccess = function(message){
    var n =   noty({
        text:message || 'Signup success',
        layout:'top',
        speed:500,
        type:'success',
        closeWith:['click'],
        theme:'relax',
        animation   : {
            open  : 'animated fadeInDown',
            close : 'animated fadeOutRight',
            speed : 100
        }
      });
      return n;
  }
  return {
    init:init
  }
}())
