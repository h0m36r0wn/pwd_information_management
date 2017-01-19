$(document).ready(function(){
  annObj.init();
})


var annObj = (function(){
  var $nonDt = $('#annTbl');
  var $delBtn = $('.delete-item');
  var init = function(){
    displayData();

  }

  var displayData = function(){
    var tbl = createTbl();
    getAnnoucements().then(function(resp){
        $.each(resp, function(ind, obj){
          var buttons = '<a href="/announcements/edit/'+obj._id+'" class="btn btn-warning"><i class="fa fa-pencil delete-btn" data-itemid="'+obj._id+'" aria-hidden="true"></i></a> <a class="btn btn-danger delete-item" data-item="'+obj._id+'"><i class="fa fa-trash" aria-hidden="true"></i></a>'
          tbl.row.add([obj.title, obj.content_type,moment(new Date( obj.date_created)).format('MMM D, YYYY'),buttons]).draw();
        })
        $('.delete-item').click(function(){
          var annId = $(this).data('item');
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
    })
  }
  var createTbl = function(){
    return $nonDt.DataTable();
  }

  var getAnnoucements = function(){
    return $.ajax({
      type:'GET',
      url:'/announcements/listing'
    })
  }

  var sendDeleteRequest = function(data){
    return $.ajax({
      type:'POST',
      url:'/announcements/delete',
      data:data
    })
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
  return { init: init}
}())
