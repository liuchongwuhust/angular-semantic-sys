
 cspCtrls.controller('allocateStockCtrl',
 function($scope,$state) {


   $scope.allocateStockCtrlInit = function(){
     document.getElementById('csp_header_containter').style.display = "none";
     document.getElementById('csp_footer').style.display = "none";
     document.getElementById('homeSpaceDiv_37px').style.display = "none";
     //计算一下屏幕高度*0.8
    //  var height = document.documentElement.clientHeight;
    //  var minHeight = height + "px";
    //  document.getElementById('csp_allocate_content_div').style.minHeight = minHeight;
     window.scrollTo(0,0);
   }


 })
