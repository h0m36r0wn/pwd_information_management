$(document).ready(function(){
  indexFunc.init();
})

var indexFunc = (function(){
  var $heroImg = $("#hero-section");
  var init = function(){
    paralax();
  }

  var paralax = function(){
    $.stellar({
    horizontalScrolling: false,
        responsive: true
    });
  }
  return{
    init:init
  }
}())
