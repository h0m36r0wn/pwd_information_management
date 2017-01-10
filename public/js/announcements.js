$(document).ready(function(){
  annObj.init();
})

var annObj = (function(){
  var $dateCreated = $('.date-created');
  var $listItems = $('#annoucements-items');
  var init = function(){
    formatDate();
    paginate();
  }

  var formatDate =function(){
    $dateCreated.html(function(index, value) {
    return moment(new Date(value)).format("MMM D Y");
    });
  }
  var paginate = function(){
    if($('#annoucements-items li ').length > 5){
      $listItems.paginate({itemsPerPage: 5})
    }else{
      $('#annoucements-items').css('display','inherit');
      $('#annoucements-items-pagination').css('display','none');
    }
  }
  return {
    init:init
  }
}())
