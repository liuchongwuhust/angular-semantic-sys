/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */
 cspCtrls.controller('allocateStockCtrl',
 function($scope,$state) {

//跳转到交易小组管理
  $scope.goTradeTeamManage = function(){
    $state.go('tradeTeamManage')
  }



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

   //跳转到操作员管理
   $scope.goOperManage = function() {
       $state.go('opermanage');
   }


 })
