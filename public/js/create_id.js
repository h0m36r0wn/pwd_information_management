$(document).ready(function(){
  createId.init();
})

var createId = (function(){

  var init = function(){
    $('#printId').click(function(){
      window.print();
    })

  }

  var afterPrint = function() {
      $.ajax({
        type:'POST',
        url:'/pwds/notify_id',
        data:{
          print:'done',
          pwdId:pwd_id
        }
      })
  };


  if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
            if (!mql.matches) {
              afterPrint();
            } 
        });
    }
    window.onafterprint = afterPrint;


  return { init:init }
}())
