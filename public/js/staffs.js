$(document).ready(function(){
  staffs.init();
})

var staffs = (function(){
  var barangays = {
    "bagong_ilog":"Bagong Ilog"  ,
    "bambang":"Bambang"  ,
    "buting":"Buting"  ,
    "caniogan":"Caniogan"  ,
    "dela_paz":"Dela Paz" ,
    "kalawaaan":"Kalawaan"  ,
    "kapasigan":"Kapasigan"  ,
    "kapitolyo":"Kapitolyo"  ,
    "malinao":"Malinao"  ,
    "manggahan":"Manggahan"  ,
    "maybunga":"Maybunga"  ,
    "oranbo":"Oranbo" ,
    "palatiw":"Palatiw"  ,
    "pinagbuhatan":"Pinagbuhatan"  ,
    "pineda":"Pineda"  ,
    "rosario":"Rosario"  ,
    "sagad":"Sagad"  ,
    "san_antonio":"San Antonio"  ,
    "san_miguel":"San Miguel"  ,
    "san_nicolas":"San Nicolas"  ,
    "santa_cruz":"Santa Cruz"  ,
    "santa_lucia":"Santa Lucia"  ,
    "santa_rosa":"Santa Rosa"  ,
    "santo_tomas":"Santo Tomas" ,
    "sumilang":"Sumilang" ,
    "ugong":"Ugong"
  };
  var $nonDt = $('#staffList');


  var init = function(){
    displayData();
  }

  var displayData = function(){
    var tbl = createDt();
    getStaffList().then(function(staffs){
      $.each(staffs, function(ind, obj){
        var btn = '<a href="/staffs/edit/'+obj._id+'"class="btn btn-default"><i class="fa fa-pencil" aria-hidden="true"></i></a></a>'
        tbl.row.add([obj.staff_id, obj.full_name, barangays[obj.barangay],btn]).draw();
      });
    })
  }
  var createDt = function(){
    return $nonDt.DataTable();
  }
  var getStaffList = function(){
    return $.ajax({
      type:'GET',
      url:'staffs/listing'
    })

  }
  return { init: init }
}())
