$(document).ready(function(){
  pwdFunct.init();
})
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

var disabilities = {
  "blind":"Blind"  ,
  "visually_impared":"Visually Impared"  ,
  "deaf":"Deaf"  ,
  "orthopedically_chllngd":"Orthopedically Challenged"  ,
  "intellectual_problem":"Intellectual Problem"  ,
  "authism":"Authism"  ,
  "multiple_disability":"Multiple Disability"  ,
  "serious_emotional_disorder":"Serious emotional disorder"  ,
  "communication_disorder":"Communication disorder"  ,
  "deafblind":"Deaf Blind"
}

var pwdFunct = (function(){
  var $table = $('#pwdTable');
  var init = function(){
    displayRecords();
  }

  var getList = function(){
    return $.ajax({
      type:'GET',
      url:"/pwds/pwd_list"
    })
  }

  var createTable = function(){
    return $table.DataTable();
  }

  var displayRecords = function(){
    var tbl = createTable();
    getList().then(function(pwds){
      $.each(pwds, function(ind, obj){
        var buttons = '<a href="/pwds/profile/'+obj._id+'" class="btn btn-default"><i class="fa fa-eye" aria-hidden="true"></i></a> <a href="/pwds/profile/'+obj._id+'" class="btn btn-warning"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a> <a href="/pwds/profile/'+obj._id+'" class="btn btn-danger"><i class="fa fa-trash-o" aria-hidden="true"></i></a>'
        tbl.row.add([obj.pwd_id, obj.full_name,barangays[obj.barangay], disabilities[obj.disability_type],buttons]).draw();
      })
    })
  }
  return{
    init:init
  }
}())
