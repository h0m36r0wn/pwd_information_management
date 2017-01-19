$(document).ready(function(){
  reqDetails.init();
})

var reqDetails = (function(){
  var $grant = $('#grantBtn');
  var $reviewed = $('#reviewedBtn');
  var $decline = $("#declineBtn");
  var init = function(){
    grantRequest();
    reviewedRequest();
    declineRequest();
  }
  var declineRequest =  function(){
    $decline.click(function(){
      sendDeclineRequest().then(function(){
        notify("Request declined success!","success");
        setTimeout(function(){
          window.location.replace("/requests");
        },3000);
      },function(){
          notify("Awwsnap Request declined failed","error");
          setTimeout(function(){
            window.location.replace("/requests");
          },3000);
      })
    })
  }

  var sendDeclineRequest = function(){
    return $.ajax({
      type:'POST',
      url:'/requests/decline/',
      data:{
        action:'decline',
        request_id:requestId
      }
    })
  }
  var grantRequest = function(){
    $grant.click(function(){
      if(requestId.length > 0){
        sendApproval().then(function(resp){
          notify("Request granted","success");
          setTimeout(function(){
            window.location.replace("/requests");
          },3000);
        })
      }else{
        notify("Unknown error happened","error");
        setTimeout(function(){
          window.location.replace("/requests");
        },3000);
      }
    })
  }
  var reviewedRequest = function(){
    $reviewed.click(function(){
      if(requestId.length > 0){
        reviewRequest().then(function(resp){
          notify("Requests reviewed and forwarded","success");
          setTimeout(function(){
            window.location.replace("/requests");
          },3000);
        },function(err){
          notify("Unknown error happened","error");
        })
      }
    })
  }
  var notify = function(message,type){
    var n =   noty({
        text:message,
        layout:'top',
        speed:500,
        type:type,
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
  var reviewRequest = function(){
    return $.ajax({
      type:'POST',
      url:'/requests/details/'+requestId,
      data:{
        action:'reviewed',
        request_id:requestId
      }
    })
  }

  var sendApproval = function(){
    return $.ajax({
      type:'POST',
      url:'/requests/details/'+requestId,
      data:{
        action:'grant',
        request_id:requestId
      }
    })
  }



  return { init:init }
}())
