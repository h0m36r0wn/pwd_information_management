$(document).ready(function(){
  annObj.init();
})

var annObj = (function(){
  var $dateCreated = $('.date-created');
  var $listItems = $('#annoucements-items');
  var $delBtn = $('.delete-item');
  var init = function(){
    formatDate();
    paginate();
    deleteAnn();
    if(annCreated.length > 0 ){
      showNotif(annCreated, "success");
    }else if(updateSuccess.length > 0){
      showNotif(updateSuccess, "success");
    }else if(updateFailed.length > 0) {
      showNotif(updateFailed, "error");
    }
  }

  var showNotif = function(message, type){
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

  var deleteAnn = function(){
    $delBtn.click(function(){
      var annId = $(this).data('itemid');
      swal({
        title:"Are you sure you will delete this announcement",
        text:"You will not able to recover this content once it is deleted",
        type:'warning',
        confirmButtonColor:'#283593',
        showCancelButton:true,
        closeOnConfirm: false
      },function(){
        sendDeleteRequest({annId:annId}).then(function(){
          swal( "Deleted!", "Content was successfully deleted", "success" );
          setTimeout(function(){
            window.location.replace('/announcements');
          },200);
        },function(err){
          swal("Awsnap!","Unknown error happened while deleting announcement","error");
          setTimeout(function(){
            window.location.replace('/announcements');
          },200);
        })
      })
    })
  }

  var sendDeleteRequest = function(data){
    return $.ajax({
      type:'POST',
      url:'/announcements/delete',
      data:data
    })
  }
  return {
    init:init
  }
}())
