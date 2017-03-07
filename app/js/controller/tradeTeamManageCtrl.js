
 cspCtrls.controller('tradeTeamManageCtrl',
 function($scope,$state,allocateStockService) {



   //---------------------需要的初始化变量------------

    $scope.currentSelectTrid = '';
    $scope.currentTridTeam = '';
    $scope.currentSelectTridName = '';
      $scope.editGid = ''
      $scope.delGid = ''
      $scope.tridUnitHeaverBp = 0;
      $scope.tridUnitValue = 0;
    //新建小组时选择的交易员列表
    $scope.selectedTraders = [];
    //新建小组时选择的小组组长
    $scope.selectedLead = [];
    //新建小组时的小组名称
    $scope.teamName = '';
    //不同页面的标志 0表示traderTeamManage页面，1表示新建小组页面，
    $scope.status = 0;
   //---------------------需要的初始化变量------------


   $scope.allocateStockCtrlInit = function(){
     document.getElementById('csp_header_containter').style.display = "none";
     document.getElementById('csp_footer').style.display = "none";
     document.getElementById('homeSpaceDiv_37px').style.display = "none";

     window.scrollTo(0,0);


   }

// 初始化页面
$(document).ready(function(){

      $scope.cspTradeTeamManageLoadPath = 'tpls/allocateStock/tradeTeamManage.html'
      $scope.status  = 0;
})


$scope.cspTradeTeamManageLoadReady = function(){
  if(!($scope.status)){
    // 获取该登录maid下的交易单元
         var a= {maid:''};
         a.maid = 1;
         $scope.editGid = '';
         if($scope.currentSelectTrid){
           $('.js_trid').text($scope.currentSelectTridName)
         }

         allocateStockService.getModel(a, function(res){
           $scope.model = res;

           //  该页面时下拉框的初始化
                $('.js-trid').dropdown({
                    onChange: function(value, text, $choice){

                      //
                       $scope.$apply(function(){
                         $scope.currentSelectTrid = value.split('(')[1].replace(')', '');
                         $scope.currentSelectTridName = value;
                       })

                       console.log("trid-changed:", value);
                       console.log("$scope.currentSelectTrid:", $scope.currentSelectTrid);


                        //
                        // $scope.currentSelectTrid = value.split('(')[1].replace(')', '');
                        //  jQuery(".js-update-view").addClass("active")
                        //  setTimeout($scope.refreshTeam(), 1000);
                        // console.log("trid-changed:", value);
                    },
                    on: 'hover'
                })
           console.log("99999",res)
         })
  }
  else if ($scope.status == 1) {
    // 获取该登录maid下的交易单元
         var a= {maid:''};
         a.maid = 1;

         allocateStockService.getModel(a, function(res){
           $scope.model = res;
           //  该页面时下拉框的初始化
                $('.js-trid-add-new-team').dropdown({
                    onChange: function(value, text, $choice){

                       //
                        $scope.$apply(function(){
                          $scope.currentTridTeam = value.split('(')[1].replace(')', '');
                        })

                        console.log("trid-changed:", value);
                        console.log("$scope.currentTridTeam:", $scope.currentTridTeam);
                    },
                    on: 'hover'
                })

         })

  }
}





   //刷新功能
   $scope.refreshTeam = function(){
     if($scope.currentSelectTrid){
       jQuery(".js-update-view").addClass("active")

       setTimeout($scope.teamsInfo(), 1000);
     }

   }


//新建小组按钮
$scope.addNewTeam = function(){
  $scope.currentTridTeam = '';
  $scope.selectedTraders = [];
  $scope.selectedLead = [];
  $scope.cspTradeTeamManageLoadPath = 'tpls/allocateStock/addNewTeam.html'
  $scope.status  = 1;


}

// 修改按钮

$scope.editTeam = function(gid,gname){
  var gid = gid;
  var gname = gname;
  $scope.editGid = gid;
  console.log('uuuuuuuuuu',gid,gname);
  $scope.teamName = gname;
  $scope.cspTradeTeamManageLoadPath = 'tpls/allocateStock/editTeam.html';
  $scope.status  = 3;
 $scope.getTradersForEdit($scope.currentSelectTrid, gid);
}




//获取交易单元下未分组的交易员信息
$scope.getTradersNotInTeams = function(){
   console.log("$scope.currentTridTeam",$scope.currentTridTeam)
   if($scope.currentTridTeam){
     var a = {trid:''};
     a.trid = $scope.currentTridTeam;
     console.log("$scope.currentTridTeambbbbb",$scope.currentTridTeam)
     allocateStockService.getTradersNotInTeams(a, function(res){
       $scope.traders = res;
       jQuery(".js-update-view").removeClass("active")
       console.log("99999",res)
     })
   }

}

//获取交易单元下未分组以及指定小组的成员信息
$scope.getTradersForEdit = function(currentSelectTrid, gid){
   $scope.selectedTraders = [];
   $scope.selectedLead = []
   if(currentSelectTrid){
     var a = {trid:'',gid:''};
     a.trid = currentSelectTrid;
     a.gid = gid;


     allocateStockService.getTradersForEdit(a, function(res){
       $scope.traders = res;
       var b = {gid:''};
       b.gid = a.gid;
       allocateStockService.getTeamTraders(b, function(res){

         for(var i= 0; i<res.length;i++){
             $scope.selectedTraders.push(res[i].traderid)

             if(res[i].leader==1){
                 $scope.selectedLead.push(res[i].traderid) ;
             }
         }
       })

     })
   }

}
//获取交易单元下的小组详细信息
  $scope.teamsInfo = function(){
    console.log("$scope.currentSelectTrid",$scope.currentSelectTrid);
     jQuery(".js-update-view").removeClass("active")
    if($scope.currentSelectTrid){
      var a = {trid:''};
      a.trid = $scope.currentSelectTrid;

      allocateStockService.teamsInfo(a, function(res){
        $scope.teams = res;
        $scope.tridUnitHeaverBp = 0;
        for(var i=0;i<res.length;i++){
          $scope.tridUnitHeaverBp = $scope.tridUnitHeaverBp+res[i].bp_max
        }
        console.log("99999",res)
      })
    }
  }

//监听
$scope.$watch('currentTridTeam',function(){

  $scope.selectedTraders = [];
  $scope.selectedLead = [];
  $scope.teamName = '';

  $scope.getTradersNotInTeams();
})

//监听
$scope.$watch('currentSelectTrid',function(){

  $scope.selectedTraders = [];
  $scope.selectedLead = [];
  $scope.teamName = '';

  $scope.teamsInfo();
})

//选择该traderid的交易员作为小组成员
$scope.isChecked = function(traderid){
    return $scope.selectedTraders.indexOf(traderid) >= 0 ;
} ;
$scope.updateSelection = function($event,traderid){
    var checkbox = $event.target ;
    var checked = checkbox.checked ;
    if(checked){
        $scope.selectedTraders.push(traderid) ;
    }else{
        var idx = $scope.selectedTraders.indexOf(traderid) ;
        $scope.selectedTraders.splice(idx,1) ;
    }
} ;

//选择该traderid的交易员作为小组组长


  $scope.isLeaderChecked = function(traderid){
    return $scope.selectedLead.indexOf(traderid) >= 0 ;
  }
  $scope.updateSelectionLeader = function($event,traderid){
    var checkbox = $event.target ;
    var checked = checkbox.checked ;
    if(checked){
        $scope.selectedLead.push(traderid) ;
    }else{
        var idx = $scope.selectedLead.indexOf(traderid) ;
        $scope.selectedLead.splice(idx,1) ;
    }
  }

//取消新建小组并返回
$scope.noCreateandBack = function(){
  $scope.currentTridTeam = '';
  $scope.selectedTraders = [];
  $scope.selectedLead = [];
  $scope.cspTradeTeamManageLoadPath = 'tpls/allocateStock/tradeTeamManage.html';
  $scope.status = 0;


}
//确定编辑按钮{

  $scope.editTeamConfirm = function(teamName){
    console.log("teamName",teamName)
    if(!(teamName)){
      $('.creat_team_tips').css("display","block");
      $scope.creatTeamTips = '请输入小组名称'
         setTimeout(function(){
             $scope.creatTeamTips = '';
             $('.creat_team_tips').css("display","none");
         }, 1000);
    }else if(!($scope.selectedTraders.length)){
      $('.creat_team_tips').css("display","block");
      $scope.creatTeamTips = '请选择小组成员'
         setTimeout(function(){
             $scope.creatTeamTips = '';
             $('.creat_team_tips').css("display","none");
         }, 1000);

    }else if (!($scope.selectedLead.length)) {
      $('.creat_team_tips').css("display","block");
      $scope.creatTeamTips = '请为该小组选择组长'
         setTimeout(function(){
             $scope.creatTeamTips = '';
             $('.creat_team_tips').css("display","none");
         }, 1000);
    }else if ($scope.selectedLead.length>1) {

      $('.creat_team_tips').css("display","block");
      $scope.creatTeamTips = '每个小组只能选一人为小组组长'
         setTimeout(function(){
             $scope.creatTeamTips = '';
             $('.creat_team_tips').css("display","none");
         }, 1000);
    }else if( $scope.selectedTraders.indexOf($scope.selectedLead[0])<0){
      $('.creat_team_tips').css("display","block");
      $scope.creatTeamTips = '小组组长只能在小组成员中选择'
         setTimeout(function(){
             $scope.creatTeamTips = '';
             $('.creat_team_tips').css("display","none");
         }, 1000);
    }else{
      var a = {
        trid:'',
        gname:'',
        gid:'',
        traderid:[],
        leaderid:[],
        traderLength:''
      }
      a.trid = $scope.currentSelectTrid;
      a.gname = teamName;
      a.gid = $scope.editGid;
      a.traderid = $scope.selectedTraders;
      a.leaderid = $scope.selectedLead;
      a.traderLength =  $scope.selectedTraders.length;
      allocateStockService.editTeamConfirm(a,function(res){

        $('.creat_team_tips').css("display","block");
        $scope.creatTeamTips = '编辑小组成功.重新编辑小组或通过取消按钮返回'
        setTimeout(function(){
            $scope.creatTeamTips = '';
            $('.creat_team_tips').css("display","none");
        }, 5000);
      })

  }
}
//确定分组按钮
$scope.createTeamConfirm = function(teamName){

  console.log("teamName",teamName)
  if(!(teamName)){
    $('.creat_team_tips').css("display","block");
    $scope.creatTeamTips = '请输入小组名称'
       setTimeout(function(){
           $scope.creatTeamTips = '';
           $('.creat_team_tips').css("display","none");
       }, 1000);
  }else if(!($scope.selectedTraders.length)){
    $('.creat_team_tips').css("display","block");
    $scope.creatTeamTips = '请选择小组成员'
       setTimeout(function(){
           $scope.creatTeamTips = '';
           $('.creat_team_tips').css("display","none");
       }, 1000);

  }else if (!($scope.selectedLead.length)) {
    $('.creat_team_tips').css("display","block");
    $scope.creatTeamTips = '请为该小组选择组长'
       setTimeout(function(){
           $scope.creatTeamTips = '';
           $('.creat_team_tips').css("display","none");
       }, 1000);
  }else if ($scope.selectedLead.length>1) {

    $('.creat_team_tips').css("display","block");
    $scope.creatTeamTips = '每个小组只能选一人为小组组长'
       setTimeout(function(){
           $scope.creatTeamTips = '';
           $('.creat_team_tips').css("display","none");
       }, 1000);
  }else if( $scope.selectedTraders.indexOf($scope.selectedLead[0])<0){
    $('.creat_team_tips').css("display","block");
    $scope.creatTeamTips = '小组组长只能在小组成员中选择'
       setTimeout(function(){
           $scope.creatTeamTips = '';
           $('.creat_team_tips').css("display","none");
       }, 1000);
  }else{

    var a = {
      trid:'',
      gname:'',
      traderid:[],
      leaderid:[],
      traderLength:''
    }
    a.trid = $scope.currentTridTeam;
    a.gname = teamName;
    a.traderid = $scope.selectedTraders;
    a.leaderid = $scope.selectedLead;
    a.traderLength =  $scope.selectedTraders.length;
    allocateStockService.addNewTeam(a,function(res){

      $scope.selectedTraders = [];
      $scope.selectedLead = [];
      $scope.teamName = '';
      $scope.getTradersNotInTeams();
      $('.creat_team_tips').css("display","block");
      $scope.creatTeamTips = '新建小组成功.再新建一个小组或通过取消按钮返回'
      setTimeout(function(){
          $scope.creatTeamTips = '';
          $('.creat_team_tips').css("display","none");


      }, 5000);
    })

  }
}

/**
 * @desc 更新弹出层的显示状态
 * @author ll
 * @param {String} className - 弹出层的类名
 * @param {String} showState - 弹出层的显示状态
 */

 $scope.updateModalState = function(className, showState){
     jQuery('.' + className).modal(showState);
 }

 /**
  * @desc 删除小组信息按钮
  * @author ll
  * @param {String} gid - 删除的小组id
  */


$scope.delTeam = function(gid){
  $scope.delGid = gid;
  $scope.updateModalState('js-team-del-page','toggle');
}

/**
 * @desc 删除小组确定。删除该小组，及小组成员信息，后期将继续删除该小组上的分券结果
 * @author ll
 * @param {String} gid - 删除的小组id
 */
$scope.delTeamConfirm = function(){
  var a = {gid:''};
  a.gid = $scope.delGid;
  allocateStockService.delGid(a, function(res){
    $scope.delGid = '';
  })
}

/**
 * @desc 小组详情按钮
 * @author ll
 * @param {String} gid - 小组名称
 * @param {String} gname - 小组名称
 */
$scope.teamDetail = function(gid,gname){
  var gid = gid;
  var gname = gname;


  $scope.teamName = gname;
  $scope.cspTradeTeamManageLoadPath = 'tpls/allocateStock/tradeTeamDetail.html';
  $scope.status  = 4;
 $scope.getTradersForEdit($scope.currentSelectTrid, gid);

}

//左侧侧边栏的跳转
//跳转到交易小组管理
  // $scope.goTradeTeamManage = function(){
  //   $state.go('tradeTeamManage')
  // }
  // $scope.goOperManage = function(){
  //      $state.go('opermanage');
  // }
  //
  //
  //


 })
