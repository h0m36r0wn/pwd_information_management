$(document).ready(function(){
  requests.init();
})

var requests = (function(){

  var $nonDataTbl = $('#requestTbl');

  var init = function(){
    displayDatas();
  }

  var displayDatas = function(){
    getRequests().then(function(reqs){
      var tbl = createTbl();
      if(role == 'user'){
        $.each(reqs, function(ind, obj){
            var status;
            if(obj.isGranted == false && obj.isReviewed == false && obj.isDeclined == false){
              status = "Pending";
            }else if(obj.isGranted == false && obj.isReviewed == true){
              status = "Reviewed / Forwarded";
            }else if(obj.isGranted == true){
              status = "Granted"
            }else if(obj.isDeclined == true){
              status = "Declined";
            }
            tbl.row.add([obj.request_id, obj.title, moment(new Date(obj.date_created)).format("MMMM D, YYYY "), status]).draw();
        })
      }else{
        $.each(reqs, function(ind, obj){
            var button = '<a href="/requests/details/'+obj._id+'" class="btn btn-default"><i class="fa fa-eye" aria-hidden="true"></i></a>';
            tbl.row.add([obj.request_id, obj.title, moment(new Date(obj.date_created)).format("MMMM D, YYYY "), obj.requestedBy.full_name, button]).draw();
        })
      }
    })
  }
  var getRequests = function(){
    return $.ajax({
      type:'GET',
      url:'/requests/request_listing'
    });
  }
  var createTbl = function(){
    return $nonDataTbl.DataTable();
  }
  return {
    init:init
  }
}())
