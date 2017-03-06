/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */


//这个controller的数据结构采用字符升序排列,新插入的数据也是升序插入才能正常工作


cspCtrls.controller('unitManageCtrl',
function($scope,$state,$timeout,UserInfoService,unitManageService,operLoginService) {
  $scope.assetManagers=[];//保存所有的资产管理人
  $scope.allUnits=[];//保存所有的单元
  $scope.modalLoadPath='';//modal的加载路径
  $scope.allState=[{'desc':'可用','stat':'0'},{'desc':'冻结','stat':'1'}];

  $scope.selectState=$scope.allState[0];
  $scope.unitName=''; //资产管理人的名字
  $scope.currOperateUnit={};//当前的操作的单元
  $scope.currSelecetedUnit={};//当前的选择的单元


  $scope.unitManage=$scope;//保存自己,在html中通过该属性访问其他属性,因为angularjs自身有点问题

  $scope.editingManager=true;
  $scope.editingAssetUnit=true;
  $scope.editingTradeUnit=true;

  $scope.cookieinfo={};
  $scope.searchField='';

  // 初始化页面
    $(document).ready(function(){
      document.getElementById('csp_header_containter').style.display = "none";
      document.getElementById('csp_footer').style.display = "none";
      document.getElementById('homeSpaceDiv_37px').style.display = "none";
      document.getElementById('uiView').style.minHeight = "100%";

      console.log('unitManageCtrl ready');
      $scope.getAllAssetManagers();
    });


    $scope.unitManageInit = function() {
 		document.getElementById('csp_header_containter').style.display = "none";
  		document.getElementById('csp_footer').style.display = "none";
  		document.getElementById('homeSpaceDiv_37px').style.display = "none";
 		//读取cookie
 		if(!(document.cookie || navigator.cookieEnabled)) {
 			alert("浏览器未开启cookie,网站可能无法正常使用");
 			$state.go('operlogin');
 		}
 		else {
 			$scope.cookieinfo.exist = false;
 			var cookieName = "cspOperLoginInfo=";
 			var clist = document.cookie.split(";");
 			for(var i = 0; i< clist.length; i++) {
 				var ca = clist[i].trim();
 				if(ca.indexOf(cookieName) == 0) {
 					$scope.cookieinfo.cookieExist = true;
 				    var accountInfo = JSON.parse(unescape(ca.substring(cookieName.length,ca.length)));
                     $scope.cookieinfo.login_maid = accountInfo.maid;
     				$scope.cookieinfo.login_oid = accountInfo.oid;
     				$scope.cookieinfo.login_pass = accountInfo.password;
                     break;
 				}
 			}

             console.log("开始自动登录");
 			//检查登录状态及cookie自动登录
 			operLoginService.cspOperCheckAndLogin($scope.cookieinfo,function(res) {
 				if(res.result == "succeed") {

 				}
 				else {
 					$state.go('operlogin');
 				}
 			})
 		}
 	 }

    $scope.showError=function(reason){

      document.getElementById('errorReason').innerHTML=reason;
      document.getElementById('errorMessage').style.display='';
      if ($scope.timeout) {
        $timeout.cancel($scope.timeout);
      }
      $scope.timeout=$timeout(function () {
        document.getElementById('errorMessage').style.display='none';
      }, 5000);

    }

    //获取所有的资产管理人
    $scope.getAllAssetManagers=function(){
      unitManageService.getAllAssetManagers('',function(res){
        if (res.result==false) {
          return;
        }
        // $scope.allUnits=res;
        $scope.allUnits=res;
        for (var i = 0; i < res.length; i++) {
          res[i].id=res[i].maid;
          res[i].name=res[i].maname;
          res[i].type=1;  //1表示资产管理人,2表示资产单元,3表示交易单元
          res[i].haveData=true;
          res[i].show=true;
          res[i].showChild=false;
        }
        // console.log('getAllAssetManagers',$scope.allUnits);
        $scope.getAllAssetUnits();

      });
    }

    //获取所有的资产管理人
    $scope.getAllAssetUnits=function(){
      unitManageService.getAllAssetUnits('',function(res){
        if (res.result===false) {
          return;
        }
        // $scope.allUnits=res;
        $scope.allAssetUnits=res;
        var i = 0;
        for (var j = 0; j < $scope.allUnits.length; j++) {
          for (; i < res.length; i++) {
            res[i].id=res[i].caid;
            res[i].name=res[i].caname;
            res[i].type=2;  //1表示资产管理人,2表示资产单元,3表示交易单元
            res[i].haveData=true;
            res[i].show=false;
            res[i].showChild=false;
            if ($scope.allUnits[j].maid===res[i].maid) {
              // $scope.allUnits.push(res[i]);
              $scope.allUnits.splice(++j,0,res[i])
              // j++;
            }else {
              break;
            }

          }
          var addObj={};
          addObj.type=2;//1表示资产管理人,2表示资产单元,3表示交易单元
          addObj.addAssetUnit=true;//表示该项只用于添加
          addObj.maid=$scope.allUnits[j].maid;
          addObj.show=false;
          $scope.allUnits.splice(++j,0,addObj);
        }

        // console.log('getAllAssetUnits',$scope.allUnits);
        $scope.getAllAssetTraders();
      });
    }

    //获取所有的资产管理人
    $scope.getAllAssetTraders=function(){
      unitManageService.getAllAssetTraders('',function(res){
        if (res.result==false) {
          return;
        }
        // $scope.allUnits=res;
        $scope.allTraderUnits=res;
        console.log('getAllAssetTraders',res);
        var i=0;
        for (var j = 0; j < $scope.allUnits.length; j++) {
          for (; i < res.length; i++) {
            res[i].id=res[i].trid;
            res[i].name=res[i].trname;
            res[i].type=3;  //1表示资产管理人,2表示资产单元,3表示交易单元
            res[i].haveData=true;
            res[i].show=false;
            res[i].showChild=false;
            if ($scope.allUnits[j].maid===res[i].maid&&
              $scope.allUnits[j].caid===res[i].caid&&
            $scope.allUnits[j].addAssetUnit!==true) {
              $scope.allUnits.splice(++j,0,res[i])

            }
            else {
              break;
            }
          }
          if (typeof $scope.allUnits[j].caid != 'undefined'&&
              $scope.allUnits[j].addAssetUnit!==true) {
                var addObj={};
                addObj.type=3;
                addObj.addTradeUnit=true;//表示该项只用于添加
                addObj.caid=$scope.allUnits[j].caid;//资产单元id
                addObj.maid=$scope.allUnits[j].maid;//它的maid等于之前一项的maid
                addObj.show=false;
                $scope.allUnits.splice(++j,0,addObj);
          }


        }
        // console.log($scope.allUnits);

      });
    }

    //获取目标资产管理人下的资产单元
    $scope.getAssetUnitFromCapManager=function(managerid){
      //首先对该资产管理人下的所有资产单元可见性置反
      for (var i = 0; i < $scope.allUnits.length; i++) {
        if ($scope.allUnits[i].maid==managerid) {

          //当前的资产管理人是可见的
          if ($scope.allUnits[i].showChild==true) {
            for (var j = i+1; j < $scope.allUnits.length; j++) {
              if ($scope.allUnits[j].maid==managerid&& $scope.allUnits[j].type>1) {
                $scope.allUnits[j].showChild=false;
                $scope.allUnits[j].show=false;
              }else {
                break;  //后面的直接跳过,因为是该资产管理人的所属都是连续的
              }
            }
          }else{
            for (var j = i+1; j < $scope.allUnits.length; j++) {
              if ($scope.allUnits[j].maid==managerid&& $scope.allUnits[j].type==2) {
                $scope.allUnits[j].show=true;
              }else {
                continue; //后面的不跳过,因为是该资产管理人的所属可能不是连续的
              }
            }
          }
          //当前的资产管理人可见性置反
          $scope.allUnits[i].showChild=!$scope.allUnits[i].showChild;
          break;
        }
      }
      // //如果已经获取过数据,则不用再次获得
      // if( $scope.allUnits[i].haveData==true)
      //   return;
      //
      // //当前的资产管理人单元已经拥有数据
      // $scope.allUnits[i].haveData=true;
      //
      // var params={'maid':managerid};
      // unitManageService.getAssetUnitFromCapManager(params,function(res){
      //   if (res.result==false) {
      //     return;
      //   }
      //
      //
      //   for (var j = 0; j < res.length; j++) {
      //     res[j].id=res[j].caid;
      //     res[j].name=res[j].caname;
      //     res[j].type=2;  //1表示资产管理人,2表示资产单元,3表示交易单元
      //     res[j].show=true;
      //     $scope.allUnits.splice(++i,0,res[j]);
      //
      //   }
      //   var addObj={};
      //   addObj.type=2;
      //   addObj.addAssetUnit=true;//表示该项只用于添加
      //   addObj.maid=managerid;
      //   addObj.show=true;
      //   $scope.allUnits.splice(++i,0,addObj);
      //
      //   console.log(i,$scope.allUnits);
      //
      //
      // });
    }

    $scope.getTransUnitFromAssetUnit=function(assetUnitID){

      for (var i = 0; i < $scope.allUnits.length; i++) {
        if ($scope.allUnits[i].caid==assetUnitID) {

          //当前的资产管理人可见性置反
          $scope.allUnits[i].showChild=!$scope.allUnits[i].showChild;

          for (var j = i+1; j < $scope.allUnits.length; j++) {
            if ($scope.allUnits[j].caid==assetUnitID&&($scope.allUnits[j].type==3)) {
              //当前的资产单元可见性置反
              $scope.allUnits[j].show=!$scope.allUnits[j].show;
            }else {
              break;
            }
          }

          // if ($scope.allUnits[i].showChild==true) {
          //   $scope.allUnits[i].showChild=false;
          //   return;
          // }
          // $scope.allUnits[i].showChild=true;//只要点击了就设置为显示了该分组
          break;
        }
      }
      //如果已经获取过数据,则不用再次获得
      // if($scope.allUnits[i].haveData)
      //   return;
      // $scope.allUnits[i].haveData=true;
      //
      // var params={'caid':assetUnitID};
      // unitManageService.getTransUnitFromAssetUnit(params,function(res){
      //   if (res.result ==false) {
      //     return;
      //   }
      //
      //   for (var j = 0; j < res.length; j++) {
      //     res[j].id=res[j].trid;
      //     res[j].name=res[j].trname;
      //     res[j].type=3;  //1表示资产管理人,2表示资产单元,3表示交易单元
      //     res[j].show=true;
      //     $scope.allUnits.splice(++i,0,res[j]);
      //   }
      //
      //   var addObj={};
      //   addObj.type=3;
      //   addObj.addTradeUnit=true;//表示该项只用于添加
      //   addObj.caid=assetUnitID;//资产单元id
      //   addObj.maid=$scope.allUnits[i].maid;//它的maid等于之前一项的maid
      //   addObj.show=true;
      //   $scope.allUnits.splice(++i,0,addObj);
      // });
    }

    $scope.clickUnit=function(destUnit){
      console.log('clickUnit',destUnit);
      if (destUnit.type==1) {
        $scope.getAssetUnitFromCapManager(destUnit.id);
      }
      else if (destUnit.type==2){

        if (!destUnit.addAssetUnit) {//如果它是展开资产单元的
          $scope.getTransUnitFromAssetUnit(destUnit.id);

        }
        else {
          console.log('添加资产单元');
        }
      }
      else if (destUnit.type==3){
        if(destUnit.addTradeUnit){
          console.log('添加交易单元');

        }
        else {
          console.log('点击交易单元');

        }
      }
    }

    $scope.frozenAssetManager=function(assetManagerID){
      var params={};
      params.maid=assetManagerID;
      unitManageService.frozenAssetManager(params,function(res){
        if (res.result==false) {
          return;
        }
        for (var i = 0; i < $scope.allUnits.length; i++) {
          if ($scope.allUnits[i].type==1&&$scope.allUnits[i].maid==assetManagerID) {
            $scope.allUnits[i].stat='1';
            break;
          }
        }
      });
    }
    $scope.frozenAssetUnit=function(assetUnitID){
      var params={};
      params.caid=assetUnitID;
      unitManageService.frozenAssetUnit(params,function(res){
        if (res.result==false) {
          return;
        }
        for (var i = 0; i < $scope.allUnits.length; i++) {
          if ($scope.allUnits[i].type==2&&$scope.allUnits[i].caid==assetUnitID) {
            $scope.allUnits[i].stat='1';
            break;
          }
        }
      });
    }

    $scope.frozenTradeUnit=function(tradeUnitID){
      var params={};
      params.trid=tradeUnitID;
      unitManageService.frozenTradeUnit(params,function(res){
        if (res.result==false) {
          return;
        }
        for (var i = 0; i < $scope.allUnits.length; i++) {
          if ($scope.allUnits[i].type==3&&$scope.allUnits[i].trid==tradeUnitID) {
            $scope.allUnits[i].stat='1';
            break;
          }
        }
      });
    }

    $scope.unfreezeAssetManager=function(assetManagerID){
      var params={};
      params.maid=assetManagerID;
      console.log('unfreezeAssetManager',$scope.allUnits,assetManagerID);

      unitManageService.unfreezeAssetManager(params,function(res){
        if (res.result==false) {
          return;
        }
        for (var i = 0; i < $scope.allUnits.length; i++) {
          if ($scope.allUnits[i].type==1&&$scope.allUnits[i].maid==assetManagerID) {
            $scope.allUnits[i].stat='0';
            break;
          }
        }
      });
    }
    $scope.unfreezeAssetUnit=function(assetUnitID){
      var params={};
      params.caid=assetUnitID;
      unitManageService.unfreezeAssetUnit(params,function(res){
        if (res.result==false) {
          return;
        }
        for (var i = 0; i < $scope.allUnits.length; i++) {
          if ($scope.allUnits[i].type==2&&$scope.allUnits[i].caid==assetUnitID) {
            $scope.allUnits[i].stat='0';
            break;
          }
        }
      });
    }

    $scope.unfreezeTradeUnit=function(tradeUnitID){
      var params={};
      params.trid=tradeUnitID;
      unitManageService.unfreezeTradeUnit(params,function(res){
        if (res.result==false) {
          return;
        }
        for (var i = 0; i < $scope.allUnits.length; i++) {
          if ($scope.allUnits[i].type==3&&$scope.allUnits[i].trid==tradeUnitID) {
            $scope.allUnits[i].stat='0';
            break;
          }
        }
      });
    }

    $scope.frozen=function(unitObj){
      if (unitObj.type==1) {

        $scope.frozenAssetManager(unitObj.maid);


      }else if (unitObj.type==2) {

        $scope.frozenAssetUnit(unitObj.caid);

      }else if (unitObj.type==3) {

        $scope.frozenTradeUnit(unitObj.trid);

      }
    }

    $scope.unfreeze=function(unitObj){
      if (unitObj.type==1) {
        console.log(unitObj);
        $scope.unfreezeAssetManager(unitObj.id);

      }else if (unitObj.type==2) {

        $scope.unfreezeAssetUnit(unitObj.id);

      }else if (unitObj.type==3) {

        $scope.unfreezeTradeUnit(unitObj.id);

      }
    }

    $scope.addManager=function(){

        $scope.currOperateUnit.maid='';
        $scope.unitName='';

        $scope.editingManager=false;
        $scope.currSelecetedUnit={};

        $scope.selectState=$scope.allState[0];

        $scope.modalLoadPath='tpls/unitManage/assetManager.html';//modal的加载路径
        $('#unitManageModal').modal('show');




    }

    $scope.addAssetUnit=function(prveAssetUnit,index){

      console.log('addAssetUnit',prveAssetUnit);

        $scope.currOperateUnit.maid=prveAssetUnit.maid;
        $scope.currOperateUnit.caid='';
        $scope.unitName='';

        $scope.editingAssetUnit=false;

        $scope.currSelecetedUnit=prveAssetUnit;
        $scope.currSelecetedUnit.index=index;//保存该对象在数组中的位置

        $scope.selectState=$scope.allState[0];

        $scope.modalLoadPath='tpls/unitManage/assetUnit.html';//modal的加载路径
        $('#unitManageModal').modal('show');

    }

    $scope.addTradeUnit=function(prveTradeUnit,index){

      console.log('addTradeUnit',index);

        $scope.currOperateUnit.maid=prveTradeUnit.maid;
        $scope.currOperateUnit.caid=prveTradeUnit.caid;
        $scope.currOperateUnit.trid='';
        $scope.unitName='';

        $scope.editingTradeUnit=false;

        $scope.currSelecetedUnit=prveTradeUnit;
        $scope.currSelecetedUnit.index=index;//保存该对象在数组中的位置

        $scope.selectState=$scope.allState[0];

        $scope.modalLoadPath='tpls/unitManage/tradeUnit.html';//modal的加载路径
        $('#unitManageModal').modal('show');



    }

    $scope.editUnit=function(unitManager){
      $scope.currSelecetedUnit=unitManager;
      $.extend($scope.currOperateUnit,$scope.currSelecetedUnit);
      // document.getElementById('errorMessage').style.display='none';


      //更新名字和状态
      $scope.unitName=$scope.currSelecetedUnit.name;
      var stateIndex=parseInt($scope.currSelecetedUnit.stat);
      $scope.selectState=$scope.allState[stateIndex];

      console.log(stateIndex,$scope.selectState,$scope.allState);

      switch(unitManager.type){
        case 1:
        $scope.editingManager=true;
        $scope.modalLoadPath='tpls/unitManage/assetManager.html';//modal的加载路径
        break;
        case 2:
        $scope.editingAssetUnit=true;
        $scope.modalLoadPath='tpls/unitManage/assetUnit.html';//modal的加载路径
        break;
        case 3:
        $scope.editingTradeUnit=true;
        $scope.modalLoadPath='tpls/unitManage/tradeUnit.html';//modal的加载路径
        break;
      }
      $('#unitManageModal').modal('show');
    }

    // $scope.editAssetUnit=function(unitManager){
    //   $scope.editingManager=true;
    //   $scope.currSelecetedUnit=unitManager;
    //
    //   //更新名字和状态
    //   $scope.unitName=$scope.currSelecetedUnit.name;
    //   var stateIndex=parseInt($scope.currSelecetedUnit.stat);
    //   $scope.selectState=$scope.allState[stateIndex];
    //
    //   console.log(stateIndex,$scope.selectState,$scope.allState);
    //
    //   $scope.modalLoadPath='tpls/unitManage/assetUnit.html';//modal的加载路径
    //   $('#unitManageModal').modal('show');
    // }
    //
    // $scope.editTradeUnit=function(unitManager){
    //   $scope.editingManager=true;
    //   $scope.currSelecetedUnit=unitManager;
    //
    //   //更新名字和状态
    //   $scope.unitName=$scope.currSelecetedUnit.name;
    //   var stateIndex=parseInt($scope.currSelecetedUnit.stat);
    //   $scope.selectState=$scope.allState[stateIndex];
    //
    //   console.log(stateIndex,$scope.selectState,$scope.allState);
    //
    //   $scope.modalLoadPath='tpls/unitManage/tradeUnit.html';//modal的加载路径
    //   $('#unitManageModal').modal('show');
    // }

    $scope.saveOperateManager=function(state){
      var testStr=/^\d+$/;
      if (!testStr.test($scope.currOperateUnit.maid)) {
        $scope.showError('资产管理人id必须全为数字');
        return;
      }

      if ($scope.unitName=='') {
        $scope.showError('名称不能为空');
        return;
      }
      if ($scope.currOperateUnit.maid<1) {
        $scope.showError('单元编号必须大于0');
        return;
      }

      var params={};
      params.stat=state.stat;
      params.maname=$scope.unitName;
      params.maid=$scope.currOperateUnit.maid;

      if ($scope.editingManager) {
        params.maid=$scope.currSelecetedUnit.maid;
        unitManageService.saveEditAssetManager(params,function(res){
          if (res.result==false) {
            $scope.showError(res.reason);

            return;
          }
          $scope.currSelecetedUnit.stat=params.stat;
          $scope.currSelecetedUnit.maname=$scope.unitName;
          $scope.currSelecetedUnit.name=$scope.unitName;

          $('#unitManageModal').modal('hide');

        });

      }
      else {
        unitManageService.createAssetManager(params,function(res){
          if (res.result==false) {
            $scope.showError(res.reason);

            return;
          }
          var unitManager={};
          unitManager.id=res.maid;
          unitManager.maid=res.maid;
          unitManager.stat=params.stat;
          unitManager.type=1;  //1表示资产管理人,2表示资产单元,3表示交易单元
          unitManager.name=params.maname;
          unitManager.show=true;
          unitManager.showChild=false;

          var addObj={};
          addObj.type=2;//1表示资产管理人,2表示资产单元,3表示交易单元
          addObj.addAssetUnit=true;//表示该项只用于添加
          addObj.maid=res.maid;
          addObj.show=false;

          var index= getInsertIndex(unitManager,($scope.allUnits.length-1));

          // console.log('index',$scope.allUnits.length-1,index);
          $scope.allUnits.splice(index,0,unitManager,addObj);
          // $scope.allUnits.push(unitManager);
          $('#unitManageModal').modal('hide');
          console.log('createAssetManager success',params,$scope.unitName);
        });
      }
    }

    $scope.cancelOperatedManager=function(){
      if($scope.editingManager){

        //更新名字和状态
        $scope.unitName=$scope.currSelecetedUnit.name;
        var stateIndex=parseInt($scope.currSelecetedUnit.stat);
        $scope.selectState=$scope.allState[stateIndex];
        console.log($scope.selectState,$scope.allState,$scope.currSelecetedUnit.stat,stateIndex);

      }
      else {
        $scope.unitName=''; //资产管理人的名字

          $scope.selectState=$scope.allState[0];
          console.log($scope.selectState,$scope.allState);
      }
    }

    $scope.saveOperateAssetUnit=function(state){

      var testStr=/^\d+$/;
      if (!testStr.test($scope.currOperateUnit.caid)) {
        $scope.showError('资产单元id必须全为数字');
        return;
      }

      if ($scope.unitName=='') {
        $scope.showError('名称不能为空');
        return;
      }

      if ($scope.currOperateUnit.caid<1) {
        $scope.showError('单元编号必须大于0');
        return;
      }

      var params={};
      params.stat=state.stat;
      params.caname=$scope.unitName;
      params.maid=$scope.currOperateUnit.maid;
      params.caid=$scope.currOperateUnit.maid+'.'+$scope.currOperateUnit.caid;

      if ($scope.editingAssetUnit) {
        unitManageService.saveEditAssetUnit(params,function(res){
          if (res.result==false) {
            $scope.showError(res.reason);

            return;
          }
          $scope.currSelecetedUnit.stat=params.stat;
          $scope.currSelecetedUnit.caname=$scope.unitName;
          $scope.currSelecetedUnit.name=$scope.unitName;

          $('#unitManageModal').modal('hide');

        });

      }
      else {
         console.log(params);
        unitManageService.createAssetUnit(params,function(res){
          if (res.result==false) {
            $scope.showError(res.reason);

            return;
          }
          var assetunit={};
          assetunit.id=res.caid;
          assetunit.maid=res.maid;
          assetunit.caid=res.caid;
          assetunit.stat=params.stat;
          assetunit.type=2;  //1表示资产管理人,2表示资产单元,3表示交易单元
          assetunit.name=params.caname;
          assetunit.caname=params.caname;
          assetunit.show=true;
          assetunit.showChild=false;

          var addObj={};
          addObj.type=3;//1表示资产管理人,2表示资产单元,3表示交易单元
          addObj.addTradeUnit=true;//表示该项只用于添加
          addObj.maid=res.maid;
          addObj.caid=res.caid;
          addObj.show=false;

          var index= getInsertIndex(assetunit,$scope.currSelecetedUnit.index-1);
          console.log('index',index);
          $scope.allUnits.splice(index,0,assetunit,addObj);

          // $scope.allUnits.splice($scope.currSelecetedUnit.index,0,assetunit);
          $('#unitManageModal').modal('hide');
          console.log('createAssetManager success',params,$scope.unitName);
        });
      }
    }

    function getInsertIndex(unit,lastIndex){

      if (unit.type===1) {
        // var currID=unit.maid;
        for (var i = lastIndex; i>=0; i--) {
              if ($scope.allUnits[i].maid<unit.maid) {
                return i+1;
              }
        }
        return 0;
      }else if (unit.type===2){

        var currID=unit.caid.split('.');
        currID=currID[currID.length-1];
        console.log('currID',currID);

        for (var i = lastIndex; i>=0; i--) {
          if (typeof $scope.allUnits[i].caid !='undefined') {
            var existID=$scope.allUnits[i].caid.split('.');
            existID=existID[existID.length-1];
            if (existID<currID) {
              return i+1;
            }
          }else if ($scope.allUnits[i].maid ===unit.maid){
            return i+1;
          }

        }
        return 0;//正常情况下不应该为0,应该出错了
      }else if (unit.type===3){
        var currID=unit.trid.split('.');
        currID=currID[currID.length-1];
        console.log('currID',currID);

        for (var i = lastIndex; i>=0; i--) {

          //判断该单元是否是资产单元
          if (typeof $scope.allUnits[i].trid !='undefined') {

              var existID=$scope.allUnits[i].trid.split('.');
              existID=existID[existID.length-1];

              if (existID<currID) {
                return i+1;
              }
          }else if ($scope.allUnits[i].caid ===unit.caid) {//如果之前的单元是资产单元,则直接加入到其后面
            return i+1;
          }
        }
        return 0;//正常情况下不应该为0,应该出错了
      }

    }

    $scope.cancelOperatedAssetUnit=function(){
      if($scope.editingManager){

        //更新名字和状态
        $scope.unitName=$scope.currSelecetedUnit.name;
        var stateIndex=parseInt($scope.currSelecetedUnit.stat);
        $scope.selectState=$scope.allState[stateIndex];
        console.log($scope.selectState,$scope.allState,$scope.currSelecetedUnit.stat,stateIndex);

      }
      else {
        $scope.unitName=''; //资产单元的名字

          $scope.selectState=$scope.allState[0];
          console.log($scope.selectState,$scope.allState);
      }
    }

    $scope.saveOperateTradeUnit=function(state){
      var testStr=/^\d+$/;
      if (!testStr.test($scope.currOperateUnit.trid)) {
        $scope.showError('交易单元id必须全为数字');
        return;
      }

      if ($scope.unitName=='') {
        $scope.showError('名称不能为空');
        return;
      }

      if ($scope.currOperateUnit.trid<1) {
        $scope.showError('单元编号必须大于0');
        return;
      }


      var params={};
      params.stat=state.stat;
      params.trname=$scope.unitName;
      params.maid=$scope.currOperateUnit.maid;
      params.caid=$scope.currOperateUnit.caid;
      params.trid=$scope.currOperateUnit.caid+'.'+$scope.currOperateUnit.trid;

      console.log(params);
      if ($scope.editingTradeUnit) {

        unitManageService.saveEditTradeUnit(params,function(res){
          if (res.result==false) {
            $scope.showError(res.reason);
            return;
          }
          $scope.currSelecetedUnit.stat=params.stat;
          $scope.currSelecetedUnit.trname=$scope.unitName;
          $scope.currSelecetedUnit.name=$scope.unitName;

          $('#unitManageModal').modal('hide');

        });

      }
      else {
        unitManageService.createTradeUnit(params,function(res){
          if (res.result==false) {
            $scope.showError(res.reason);
            return;
          }
          var unitTrader={};
          unitTrader.id=res.trid;
          unitTrader.maid=params.maid;
          unitTrader.caid=params.caid;
          unitTrader.trid=params.trid;
          unitTrader.stat=params.stat;
          unitTrader.type=3;  //1表示资产管理人,2表示资产单元,3表示交易单元
          unitTrader.name=params.trname;
          unitTrader.trname=params.trname;
          unitTrader.show=true;
          unitTrader.showChild=false;


          var index= getInsertIndex(unitTrader,$scope.currSelecetedUnit.index-1);
          console.log('index',index,$scope.currSelecetedUnit.index);
          $scope.allUnits.splice(index,0,unitTrader);

          // $scope.allUnits.splice($scope.currSelecetedUnit.index,0,unitTrader);

          $('#unitManageModal').modal('hide');
          console.log('createAssetManager success',params,$scope.unitName);
        });
      }
    }

    $scope.cancelOperated=function(){
      document.getElementById('errorMessage').style.display='none';
      $scope.modalLoadPath='';//modal的加载路径

      $scope.editingManager=true;
      $scope.editingAssetUnit=true;
      $scope.editingTradeUnit=true;
      $('#unitManageModal').modal('hide');
      }

      $scope.enterSearch=function(e){
        var keycode = window.event?e.keyCode:e.which;

        if ($scope.searchField=='') {
          for (var i = 0; i < $scope.allUnits.length; i++) {
              $scope.allUnits[i].find=false;
          }
        }

        if(keycode===13){
          console.log('enterSearch');
          for (var i = 0; i < $scope.allUnits.length; i++) {
            if ($scope.allUnits[i].addAssetUnit||
              $scope.allUnits[i].addTradeUnit) {
                continue;
            }

            var str=$scope.allUnits[i].id.toLowerCase();
            if (str.indexOf($scope.searchField)!==-1) {
              $scope.allUnits[i].find=true;
              continue;
            }

            str=$scope.allUnits[i].name.toLowerCase();
            if (str.indexOf($scope.searchField)!==-1) {
              $scope.allUnits[i].find=true;
              // continue;
            }
          }
        }


      }
      $scope.refresh=function(){
        $scope.getAllAssetManagers();
        $scope.searchField='';
      }

});
