/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */
var cspCtrls = angular.module('cspCtrls',[]);


cspCtrls.controller('AppCtrl',['$scope','$state','UserInfoService',
function($scope,$state,UserInfoService){


  $scope.currentUser = null;
  $scope.setCurrentUser = function(user){
  $scope.currentUser = user;
 }



  $scope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){

    // 如果是进入登录界面则允许
	  if(toState.name === 'home'){
      $('#loginModal').remove();
      $('#orderModal').remove();

    }else if(toState.name === 'allProducts'){
      $('#allPro_orderModal').remove();
    }
    else if(toState.name === 'usercenter'){
      $('#wechat_modal').remove();
    }
      // UserInfoService.cspCheckLoginState('',function(res){
      //   if(!res.loginState){
      //     event.preventDefault();// 取消默认跳转行为
      //     $state.go("home",{from:fromState.name,w:'notHome'});//跳转到登录界面
      //   }else{
      //     UserInfoService.cspCheckRiskState({},function(result) {
      //         if(!(result.result === 'succeed' && result.riskstate === true)) {
      //             event.preventDefault();// 取消默认跳转行为
      //             $state.go("risklevel");//跳转风险评测
      //             var a={
      //               uid:'',
      //             }
      //             a.uid=res.uid;
      //             $scope.setCurrentUser(a);
      //         }
      //         else {
      //             var a={
      //               uid:'',
      //             }
      //             a.uid=res.uid;
      //             $scope.setCurrentUser(a);
      //         }
      //     })
      // }
  // })
});



}])
