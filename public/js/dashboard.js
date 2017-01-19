$(document).ready(function(){
  dashboard.init();
})

var dashboard = (function(){
  var $catContainer = 'pwd-categeroy-chart';
  var init = function(){
    createRequestChart();
    createColumnCat();
  }

  var createRequestChart = function(){
    Highcharts.chart('request-charts',{
      title:'Weekly Requests',
      xAxis:{
        categories:['Jan 16', 'Jan 17', 'Jan 18','Jan 19','Jan 20','Jan 21','Jan 22']
      },
      yAxis:{ title:'Request Number '},
      tooltip:{ valueSuffix:'requests' },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
      },
      series:[ {   name: 'Requests', data: [5,8,6,5,6,9,11]}]
    })
  }

  var createColumnCat = function(){
    Highcharts.chart($catContainer, {
      chart:{
        type:'column'
      },
      title:{
        text:'Disability category per barangay'
      },
      xAxis:{
        categories:[
          'Blind','Visually Impared','Deaf','Orthopedically Challenged','Intellectual Problem','Authism',
          'Multiple Disability','Serious emotional disorder','Communication disorder','Deaf Blind'
        ],
        crosshair:true
      },
      plotOptions:{
        column: { pointPadding:0.2 , borderWidth: 0 }
      },
      series:[{
        name:'Buting',
        data:[22,32,15,17,32,13,14,40,12,10]
      }]
    })
  }
  return { init:init }
}())
