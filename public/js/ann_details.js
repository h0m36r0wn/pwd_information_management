$(document).ready(function(){
  annObj.init();
})

var annObj = (function(){
  var $dateCreated = $('.date-created');

  var init = function(){
    formatDate();
  }
  var formatDate =function(){
    $dateCreated.html(function(index, value) {
    return moment(new Date(value)).format("MMM D Y");
    });
  }
  return { init:init }
}())
