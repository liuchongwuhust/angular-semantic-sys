/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */
var cspApp = angular.module('cspApp', [
  'cspRouters',
  'cspCtrls',
  'cspServices',
  'cspFilters',
  'oc.lazyLoad'
]);


var cspCtrls = angular.module('cspCtrls',[]);


cspCtrls.controller('AppCtrl',['$scope','$state',
function($scope,$state){



}])


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


cspCtrls.controller('cspOperLoginCtrl',function($scope,$state,$interval,operLoginService) {
	$scope.timePromise = undefined;
	$scope.loginInfo = {};
	$scope.cspOperLoginInit = function() {
		document.getElementById('csp_header_containter').style.display = "none";
		document.getElementById('csp_footer').style.display = "none";
		document.getElementById('homeSpaceDiv_37px').style.display = "none";
		if(!(document.cookie || navigator.cookieEnabled)) {
			alert("浏览器未开启cookie,网站可能无法正常使用")
		}
		else {
			//先判断登录验证session是否具有login_maid 和 login_oid
			operLoginService.cspOperCheckLogin({},function(res) {
				if(res.result == "succeed" && res.loginState == true) {
					$state.go('allocateStock');
				}
				else {
					//读取cookie maid oid
					var exist = false;
					var operCookieInfo;
					var cookieName = "cspOperLoginInfo=";
					var clist = document.cookie.split(";");
					for(var i = 0; i< clist.length; i++) {
						var ca = clist[i].trim();
						if(ca.indexOf(cookieName) == 0) {
							exist = true;
							operCookieInfo = JSON.parse(unescape(ca.substring(cookieName.length,ca.length)));
							break;
						}
					}

					if(exist) {
						$scope.loginInfo.maid = operCookieInfo.maid;
						$scope.loginInfo.oid = operCookieInfo.oid;
						$scope.loginInfo.password = operCookieInfo.password;
						$scope.loginInfo.logining = true;
						$scope.loginInfo.loadState = "正在登录";
						$scope.loginInfo.error = false;
						$scope.loginInfo.save = operCookieInfo.save;
						var json = {};
						json.login_maid = $scope.loginInfo.maid;
						json.login_oid = $scope.loginInfo.oid;
						json.login_pass = $scope.loginInfo.password;
						operLoginService.cspOperLogin(json,function(res) {
							if(res.result == "succeed") {
								$scope.loginInfo.loadState = "登录成功";
								$state.go('allocateStock');
							}
							else {
								var second = 2;
								$scope.loginInfo.error = true;
								$scope.loginInfo.loadState = res.reason;
								$scope.timePromise = undefined;
								$scope.timePromise = $interval(function(){
									if(second<=0){
									  $interval.cancel($scope.timePromise);
									  $scope.timePromise = undefined;
									  $scope.loginInfo.logining = false;
									}else{
									  second--;
									}
								},500,100);
							}
						})
					}
					else {
						//显示登录界面
						$scope.loginInfo.maid = "";
						$scope.loginInfo.oid = "";
						$scope.loginInfo.password = "";
						$scope.loginInfo.logining = false;
						$scope.loginInfo.loadState = "正在登录";
						$scope.loginInfo.error = false;
						$scope.loginInfo.save = false;
					}
				}
			})
		}
	}

	$scope.cspOperLoginClick = function() {
		var second = 1;
		$scope.loginInfo.logining = true;
		$scope.loginInfo.error = false;
		$scope.loginInfo.loadState = "正在登录";
		$scope.loginInfo.error = false;
		if($scope.loginInfo.maid == "") {
			$scope.loginInfo.error = true;
			$scope.loginInfo.loadState = "请输入资产管理人编号";
			$scope.timePromise = undefined;
			$scope.timePromise = $interval(function(){
				if(second<=0){
				  $interval.cancel($scope.timePromise);
				  $scope.timePromise = undefined;
				  $scope.loginInfo.logining = false;
				}else{
				  second--;
				}
			},500,100);
		}
		else if($scope.loginInfo.oid == "") {
			$scope.loginInfo.error = true;
			$scope.loginInfo.loadState = "请输入操作员账号";
			$scope.timePromise = undefined;
			$scope.timePromise = $interval(function(){
				if(second<=0){
				  $interval.cancel($scope.timePromise);
				  $scope.timePromise = undefined;
				  $scope.loginInfo.logining = false;
				}else{
				  second--;
				}
			},500,100);
		}
		else if($scope.loginInfo.password == "") {
			$scope.loginInfo.error = true;
			$scope.loginInfo.loadState = "请输入密码";
			$scope.timePromise = undefined;
			$scope.timePromise = $interval(function(){
				if(second<=0){
				  $interval.cancel($scope.timePromise);
				  $scope.timePromise = undefined;
				  $scope.loginInfo.logining = false;
				}else{
				  second--;
				}
			},500,100);
		}
		else {
			//提交到后台验证账号密码
			var json = {};
			json.login_maid = $scope.loginInfo.maid;
			json.login_oid = $scope.loginInfo.oid;
			json.login_pass = $scope.loginInfo.password;
			operLoginService.cspOperLogin(json,function(res) {
				if(res.result == "succeed") {
					$scope.loginInfo.loadState = "登录成功";
					//判断是否需要保存cookie
					console.log($scope.loginInfo.save);
					if($scope.loginInfo.save == true) {
						var savejson = {};
						savejson.maid = $scope.loginInfo.maid;
						savejson.oid = $scope.loginInfo.oid;
						savejson.password = $scope.loginInfo.password;
						savejson.save = $scope.loginInfo.save;
						var savestr = JSON.stringify(savejson);
						//document.cookie.cspOperLoginInfo = escape(savestr);
						var expires = new Date();
					    expires.setTime(expires.getTime() + 7*24*60*60*1000);
					    var str="cspOperLoginInfo="+escape(savestr)+";expires=" + expires.toGMTString();
					    document.cookie =str;
					}
					else {
						//删除掉保存的cookie
						var cookieName = "cspOperLoginInfo=";
						var expires = new Date();
					    expires.setTime(expires.getTime());
						var clist = document.cookie.split(";");
						for(var i = 0; i< clist.length; i++) {
							var ca = clist[i].trim();
							if(ca.indexOf(cookieName) == 0) {
								document.cookie = ca + ";expires=" + expires.toGMTString();
								break;
							}
						}
					}
					$state.go('allocateStock');
				}
				else {
					$scope.loginInfo.error = true;
					$scope.loginInfo.loadState = res.reason;
					$scope.timePromise = undefined;
					$scope.timePromise = $interval(function(){
						if(second<=0){
						  $interval.cancel($scope.timePromise);
						  $scope.timePromise = undefined;
						  $scope.loginInfo.logining = false;
						}else{
						  second--;
						}
					},500,100);
				}
			})
		}
	}

})


 cspCtrls.controller('cspOperLoginOutCtrl',function($scope,$state,$interval,operLoginService){
	 $scope.cspOperLoginOutLoad = function() {
		 operLoginService.cspOperLoginOut({},function(res) {
			 //清除cookie
			 if((document.cookie || navigator.cookieEnabled)) {
				 var cookieName = "cspOperLoginInfo=";
				 var expires = new Date();
				 expires.setTime(expires.getTime());
    			 document.cookie = cookieName + ";expires=" + expires.toGMTString();
	 		}
			$state.go('operlogin');
		 })
	 }
 })


 cspCtrls.controller('randomCtrl',
 function($scope,$state,wishListService, allocateStockService, randomService) {
/*
* 全局变量定义
*/

 $scope.currentSelectTrid = '';
 $scope.currentSelectTridName = '';
 $scope.currentSelectTid = 0;
 $scope.currentSelectTidName = '';



   $scope.randomInit = function(){
     document.getElementById('csp_header_containter').style.display = "none";
     document.getElementById('csp_footer').style.display = "none";
     document.getElementById('homeSpaceDiv_37px').style.display = "none";
     window.scrollTo(0,0);
   }
   // 初始化页面
   $(document).ready(function(){
     // 获取该登录maid下的交易单元
          var a= {maid:''};
          a.maid = 1;
          allocateStockService.getModel(a, function(res){
            $scope.model = res;
            if($scope.model.length>5){
              $scope.isActive=true;
            }else{
              $scope.isActive=false;
            }

            //  该页面时下拉框的初始化
                 $('.js-trid').dropdown({
                     onChange: function(value, text, $choice){


                        $scope.$apply(function(){
                          $scope.currentSelectTrid = value.split('(')[1].replace(')', '');
                          $scope.currentSelectTridName = value;
                        })

                     },
                     on: 'hover'
                 })

          })
 })

 /**
  * @func $watch
  * @desc 监控currentSelectTrid，只有在选择了交易单元的情况下，才能进行下一步操作
  * @author ll
  * @param
  */
$scope.$watch('currentSelectTrid',function(){
  console.log('$scope.currentSelectTrid',$scope.currentSelectTrid)
  if($scope.currentSelectTrid){
    var a= {trid:''};
    a.trid = $scope.currentSelectTrid;

     wishListService.getTidModel(a, function(res){

       $scope.tidModel = res;
      if(res.length==0){
        $scope.currentSelectTid = '';
        $scope.currentSelectTidName = '单元小组';
        $('.js_tid').text($scope.currentSelectTidName)
      }else{

        if(res.length>5){
          $scope.isTidActive = true;
        }else{
          $scope.isTidActive = false;
        }


        //  该页面时下拉框的初始化
             $('.js-tid').dropdown({
                 onChange: function(value, text, $choice){
                 $scope.$apply(function(){
                   console.log(value);
                   $scope.currentSelectTid = value.split('(')[1].split(')')[0];
                     console.log('$scope.currentSelectTid',$scope.currentSelectTid)
                     //  $scope.currentSelectTidName = value;
                    })

                 },
                 on: 'hover'
             })
      }


    })


}
})

$scope.$watch('currentSelectTid',function(){
  if($scope.currentSelectTid){
     groupDisplay($scope.currentSelectTid);
     var a = {gid:$scope.currentSelectTid}
     randomService.getTname(a,function(data){
       $scope.currentSelectTidName =data.title;
       $('.js_tid').text($scope.currentSelectTidName)
     })
  }
})

/**
 * @func randomDivOnBtn
 * @desc 分券按钮，用于弹出提示
 * @author ll
 * @param
 */
$scope.randomDivOnBtn = function (){
  if( $scope.currentSelectTrid){
      jQuery('.js-random-allocated-comfirm').modal('show');
  }
  else{
      jQuery('.js-choose-random-trid').modal('show')
  }
}

/**
* @desc 一键分券中的确定分券
* @author ll
* @param
*/
$scope.randomAllocatedConfirm = function() {
    updateModalState('js-random-allocated-comfirm', 'hide');
    var a = {trid:''};
    a.trid = $scope.currentSelectTrid;

    randomService.getWishTid(a,function(wishData){
        if(typeof wishData[0]!=='undefined'){
            $scope.currentSelectTid=wishData[0].gid;
            groupOutput($scope.currentSelectTrid,$scope.currentSelectTid);
            $(".js-wait-random-div").addClass("active")
            setTimeout(function(){
                $(".js-wait-random-div").removeClass("active")
            },3000);
        }else{
            csp.notify('notice', {
                msg: '该小组无人有心愿清单，无从分券',
                delay: 5000,
            });
            console.log('该小组无人有心愿清单，无从分券')
        }
    });
}

/**
* @desc 分券并显示最小gid的分券结果
* @author ll
* @param {String} trid - 选择的交易单元id
* @param {String} tid - 选择显示结果的小组Id
*/
function groupOutput(trid,gid) {
    console.log("分券trid",trid);
    if(!trid){
        //请选择分券单元
        jQuery('.js-choose-random-trid').modal('show')
    }
    else{
        var a = {trid:'',maid:''};
        a.maid = '1';
        a.trid = trid;
        randomService.unitRandmDiv(a,function(dataR) {
        if(dataR.successOr) {
            console.log("分券成功",dataR.successOr);
            randomService.deleWishList(a,function(data){
                if(data.delWish){
                    console.log("上一次的心愿清单清除")
                }
            });
            var b = {trid:'', valueStr:''};
            b.trid = trid;


            if (dataR.UnitWish.length > 0) {
                var tempStr = '';
                for (var i = 0; i < dataR.UnitWish.length; i++) {
                    for(var j=0;j<dataR.UnitWish[i].children.length;j++){
                      tempStr += '("';
                      tempStr += dataR.UnitWish[i].gid;
                      tempStr += '","';
                      tempStr += dataR.UnitWish[i].children[j].cindex;
                      tempStr += '","';
                      tempStr += dataR.UnitWish[i].children[j].cid;
                      tempStr += '","';
                      tempStr += dataR.UnitWish[i].children[j].cname;
                      tempStr += '","';
                      tempStr += dataR.UnitWish[i].children[j].amount;
                      tempStr += '","';
                      tempStr += dataR.UnitWish[i].children[j].post_allocated_amount;
                      tempStr += '","';

                      tempStr +=  dataR.UnitWish[i].children[j].allocated_value;
                      tempStr += '","';

                      tempStr +=  trid;
                      tempStr += '"),';
                    }

                }
                if (tempStr.length > 0) {
                    b.valueStr = tempStr.substring(0, tempStr.length - 1);
                }
                b.valueStr += 'ON DUPLICATE KEY UPDATE post_allocated_amount = values(post_allocated_amount),post_allocated_value = values(post_allocated_value), amount=amount+values(amount)';


                randomService.writeResults(b,function(data){
                    if(data.writeS){
                        console.log("分券结果数据插入成功",data.writeS);
                        groupDisplay(gid);
                        $scope.currentSelectTid = gid;
                        var a = {gid:$scope.currentSelectTid}
                        randomService.getTname(a,function(data){
                          $scope.currentSelectTidName =data.title;
                          $('.js_tid').text($scope.currentSelectTidName)
                        })
                        randomService.randomOver(a,function(dataOver){
                            if(dataOver.randomOverFlag){
                              console.log('该轮分券完毕，总券还有剩余，可继续进行下一轮分券')
                                csp.notify('notice', {
                                msg: '该轮分券完毕，总券还有剩余，可继续进行下一轮分券',
                                delay: 15000,
                                });
                            }else{
                                console.log('该单元总券已全部分配完。您可点击小组查看最终分券结果。')
                                csp.notify('notice', {
                                msg: '该单元总券已全部分配完。您可点击小组查看最终分券结果。',
                                delay: 15000,
                                });
                            }
                        })

                    }
                })
              }
/*
            randomService.writeSec(a,function(data){
                if(data.writeS){
                    console.log("总券剩余数量写入成功")
                    // socket.join(trid,function(err,data){
                    //     console.log(err,data)
                    // })
                    // socket.emit('allocatedOver');
                    randomService.randomOver(a,function(dataOver){
                        if(dataOver.randomOverFlag){
                          console.log('该轮分券完毕，总券还有剩余，可继续进行下一轮分券')
                            // csp.notify('notice', {
                            // msg: '该轮分券完毕，总券还有剩余，可继续进行下一轮分券',
                            // delay: 15000,
                            // });
                        }else{
                            console.log('该单元总券已全部分配完。您可点击小组查看最终分券结果。')
                            // csp.notify('notice', {
                            // msg: '该单元总券已全部分配完。您可点击小组查看最终分券结果。',
                            // delay: 15000,
                            // });
                        }
                    })
                }

            })
            // insertEx(trid);



*/
        }
      });
    }
}

/**
* @desc 更新弹出层的显示状态
* @param {String} className - 弹出层的类名
* @param {String} showState - 弹出层的显示状态
*/
 function updateModalState(className, showState) {
    jQuery('.' + className).modal(showState);
}

/**
 * @func formatNumber
 * @desc 格式化数字
 * @param {number} num 需要被格式化的数字
 * @param {int} [precision] 格式化后的精度
 */
function formatNumber(num, precision) {
    var parts;
    // 判断是否为数字
    if (!isNaN(parseFloat(num)) && isFinite(num)) {
        num = Number(num);
        // 处理小数点位数
        num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
        // 分离数字的小数部分和整数部分
        parts = num.split('.');
        // 整数部分加[separator]分隔, 借用一个著名的正则表达式
        parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + ',');

        return parts.join('.');
    }
    return NaN;
}

/**
 * @desc 显示小组分券结果，及小组相关信息
 * @param {gid} gid 显示的小组id
 */
function groupDisplay(gid) {
  var a = {gid:''};
  a.gid = gid;
    randomService.getRandmR(a, function(receiveData) {

        $scope.randmR = receiveData;
        jQuery(".js-random-output").attr("disabled",false)
        console.log("显示当前tid的分券结果信息",a.gid);

        randomService.getTname(a,function(data){
          $scope.currentSelectTidName =data.title;
          $('.js_tid').text($scope.currentSelectTidName)
        })
        randomService.getInfobyGid(a,function(data) {
          $(".js-tid-bp").html(" 小组杠杆bp:" + formatNumber(data.t_bp,2));
          $(".js-tid-allocated-value").html("分券市值:" + formatNumber(data.t_allocated_bp,2));
        })

    })
}
/**
 * @desc 页面上的清零按钮，用于弹出是否确定清零的弹框
 */
$scope.clearRandom = function(){
    if(!$scope.currentSelectTrid){
        //请选择清零的单元
        jQuery('.js-choose-clear-trid').modal('show');
    }
    else{
        jQuery('.js-clear-random').modal('show');

    }
}
/**
 * @desc 确定对选中的单元进行清零
 * @param {gid} gid 显示的小组id
 */
$scope.clearTrid = function(){
    //  console.log('clear trid',sessionData.trid);
    var a = {maid:'', trid:''};
    a.maid = '1';
    a.trid = $scope.currentSelectTrid;
     randomService.recoverStock(a,function(dataS){
         if(dataS.recoverStock){
             //总券剩余数量恢复了
             console.log("总券剩余数量恢复了")
         }else{
             console.log("总券剩余数量恢复出错")
         }
     })
     randomService.deleResults(a,function(data){
         if(data.deleteR){
             groupDisplay(-1);
             $scope.currentSelectTidName = '单元小组';
             $('.js_tid').text($scope.currentSelectTidName)
             console.log('清零成功，可以重新分券啦～')
             csp.notify('notice', {
                 msg: '清零成功，可以重新分券啦～',
                 delay: 5000,
             });
         }
     });
    //  delExchangeData(sessionData.maid);
 }
$scope.noWishGo = function(){
     console.log("是否有小组没有心愿清单--->get");
     var a = {trid:''};
     a.trid = $scope.currentSelectTrid;
     randomService.noWishList(a,function(data){
         console.log("0为全有心愿清单，1为有人没有心愿清单",data.noWish)
         if(data.noWish==1){
             jQuery('.js-someone-no-wishlist').modal('show');
         }else if(data.noWish==-1) {
             //全都没有心愿清单
             jQuery('.js-all-no-wish').modal('show');

         }
         else{
             $scope.randomAllocatedConfirm();
         }

     })
 }


 /**
  * @func
  * @desc 结果导出
  * @author ll
  */
 //unit 单元id tid 小组id
$scope.randomOutput = function() {
     if(!$scope.currentSelectTid){

         csp.notify('notice', {
             msg: '请选择导出的小组',
             delay: 5000,
         });
     }else{
        var id = $scope.currentSelectTid
        var url = "/random/exportExcel/"+id;
        window.location = url;
     }
 }
/*
*/
})


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


 cspCtrls.controller('wishListCtrl',
 function($scope,$state,wishListService, allocateStockService, wishListService) {
/*
* 全局变量定义
*/

 $scope.currentSelectTrid = '';
 $scope.currentSelectTridName = '';
 $scope.currentSelectTid = 0;
 $scope.currentSelectTidName = '';
 // $scope.wishListTips = '';
 var drapingId = "";
 var isAddrow = false;
 $scope.surplusBp =  0;
 $scope.marketPrice = 0;


 $scope.BPvalue = 0;


   $scope.wishListCtrlInit = function(){
     document.getElementById('csp_header_containter').style.display = "none";
     document.getElementById('csp_footer').style.display = "none";
     document.getElementById('homeSpaceDiv_37px').style.display = "none";
     window.scrollTo(0,0);
   }
   // 初始化页面
   $(document).ready(function(){
     // 获取该登录maid下的交易单元
          var a= {maid:''};
          a.maid = 1;
          allocateStockService.getModel(a, function(res){
            $scope.model = res;

            //  该页面时下拉框的初始化
                 $('.js-trid').dropdown({
                     onChange: function(value, text, $choice){


                        $scope.$apply(function(){
                          $scope.currentSelectTrid = value.split('(')[1].replace(')', '');
                          $scope.currentSelectTridName = value;
                        })

                     },
                     on: 'hover'
                 })

          })

          // $(".groupWish-view").addClass("active");

          $scope.tableOperator();

          /**从左表拖动一条记录到右表*/
          $(".js-table-container,.group-wish-list-table").droppable({
              drop: function(event, ui) {

                console.log("drapingId-------------",drapingId)
                  if (drapingId !== undefined && drapingId !== "" && drapingId !== null) {
                      if (isAddrow) {
                          /** 增加一条记录 */
                          console.log('isAddrow',isAddrow)
                          var leftRowObj = $('#left' + drapingId);

                          console.log('leftRowObj------',leftRowObj)
                          var rightRowObj = $('#right' + drapingId);
                          if (rightRowObj.length > 0) {
                              console.log("exist");

                                    // $('.wish_list_tips').css("display","block");
                                    // $scope.wishListTips = '该股票已存在于心愿清单，可进行数量更改或删除操作'
                                    //   $('.wish_list_tips').text($scope.wishListTips)
                                    //    setTimeout(function(){
                                    //        $scope.wishListTips = '';
                                    //        $('.wish_list_tips').css("display","none");
                                    //    }, 3000);

                                       csp.notify('notice', {
                                           msg: '该股票已存在于心愿清单，可进行数量更改或删除操作',
                                           delay: 5000,
                                       });

                              return ;
                          } else {

                            var surBp =$(".js-surplusBp-value").text().split(':')[1];
                            $scope.surplusBP = $scope.unformat(surBp);
                            console.log($scope.surplusBP,surBp)

                              var calRlt = $scope.calCurMarketValue(drapingId, 100,$scope.surplusBP);
                              var cAmount = $scope.calCurUnitAmount(drapingId, 100);

                              if (calRlt) {
                                  var stockNum = 0;
                                  var rowObjs = $(leftRowObj).children();
                                          if(cAmount){
                                              stockNum = 100
                                          }else{
                                              stockNum = $(rowObjs[5]).html();
                                          }
                                  var stockNo = $(rowObjs[1]).html();
                                  var stockName = $(rowObjs[2]).html();
                                  var marketVal = $scope.formatNumber(100 * $scope.calStockUnitPrice(stockNo.split('.')[0]),2);
                                  var idStr = "right" + drapingId;
                                  var insertHtmlStr = '<tr class="js-right-row" id="' + idStr + '"><td>' + 0 + '</td><td>'
                                                  + stockNo + '</td><td>' + stockName + '</td><td class="js-amount-right">'
                                                  + '<div class="ui icon input js-stock-num"><input type="text" value="'
                                                  + stockNum + '" ><div class="js-num-change"><i class="caret up link icon"></i>'
                                                  + '<i class="caret down link icon"></i></div></div></td><td class="js-num-right">'
                                                  + marketVal + '</td>'
                                                  + '<td><i class="trash outline big link icon" data-content="移除"></i>'
                                                  + '</td></tr>';
                                  var tableConObjs = $(this).children();
                                  var tableConObj = tableConObjs[0];
                                  var tableObjs = $(tableConObj).children();
                                  var tableObj = tableObjs[0];
                                  var tbodyObj = tableObjs[1];
                                  var bodyObjs = $(tableObj).next().children();
                                  if (bodyObjs.length > 0) {
                                      $(tbodyObj).append(insertHtmlStr);
                                  } else {
                                      $(tableObj).next().append(insertHtmlStr);
                                  }
                                  $scope.updateCurMaketValue();
                              } else {
                                  // 弹出对话框提示超过了BP值
                                  //$('.overBP.modal').modal('show');
                                  csp.notify('notice', {
                                      msg: '超出剩余杠杆BP,无法添加进心愿清单',
                                      delay: 5000,
                                  });

                                  //      $scope.wishListTips = '超出剩余杠杆BP,无法添加进心愿清单'
                                  //      $('.wish_list_tips').css("display","block")
                                  //       $('.wish_list_tips').text($scope.wishListTips)
                                  //
                                  //          setTimeout(function(){
                                  //              $scope.wishListTips = '';
                                  //              $('.wish_list_tips').css("display","none");
                                  //          }, 3000);
                                  //
                                  //
                                  // console.log("超出剩余杠杆BP_拖动");
                              }
                              /** 注释掉了整手判断的条件 */
                              // else{
                              //     console.log("ready 超过数量")
                              //     csp.notify('notice', {
                              //         msg: '该券在券表中数量不足100，无法添加进心愿清单',
                              //         delay: 15000,
                              //     });
                              //     console.log("超出券表中该支证券数量");
                              //     return ;
                              // }
                          }
                        }
                      }
                      $scope.tableOperator();
                      $scope.dealRightTableNo();
                  }
              })


   })


   //监听
   $scope.$watch('currentSelectTrid',function(){
     console.log('$scope.currentSelectTrid',$scope.currentSelectTrid)
     if($scope.currentSelectTrid){
       var a= {trid:''};
       a.trid = $scope.currentSelectTrid;
        $scope.refreshUnitStocks($scope.currentSelectTrid)
        wishListService.getTidModel(a, function(res){

          $scope.tidModel = res;
         if(res.length==0){
           $scope.currentSelectTid = '';
           $scope.currentSelectTidName = '交易单元小组';
           $('.js_tid').text($scope.currentSelectTidName)
         }else{


           //  该页面时下拉框的初始化
                $('.js-tid').dropdown({
                    onChange: function(value, text, $choice){
                    $scope.$apply(function(){
                      console.log(value);
                      $scope.currentSelectTid = value.split('(')[1].split(')')[0];
                        console.log('$scope.currentSelectTid',$scope.currentSelectTid)
                        //  $scope.currentSelectTidName = value;
                       })

                    },
                    on: 'hover'
                })
         }


       })


  }
})

$scope.$watch('currentSelectTid',function(){
  if($scope.currentSelectTid){
    $scope.refreshBP($scope.currentSelectTid)
    $scope.refreshGroupWish($scope.currentSelectTrid,$scope.currentSelectTid)

  }
})


/**
 * @func clearTable
 * @desc 清空表格
 * @author ll
 * @param {string} idStr 想要清空的表格id
 */
$scope.clearTable = function(idStr){
    try{
        var thistable = document.getElementById(idStr);
        var trs = thistable.getElementsByTagName("tr");
        for(var i = trs.length - 1; i > 0; i--) {
            thistable.deleteRow(i);
        }
    }catch(e){

    }


}

/**
 * @func dragLeftTable
 * @desc 左表拖动
 * @author ll
 */
 $scope.dragLeftTable = function(){
    //左边表格拖拽操作
    $(".js-left-table").draggable({
        cursor: "move",
        cursorAt: { top: -2, left: -2 },
        helper: "clone",
        start: function() {
            var rows = $(this).children();
            var stockNo = $(rows[1]).html();
            drapingId = stockNo.split('.')[0];
            isAddrow = true;
        }
    });
}

/**
 * @func refreshUnitStocks
 * @desc 刷新券表界面
 * @author ll
 */
 $scope.refreshUnitStocks = function(curTrid){
    var a = {trid:''};
    a.trid = curTrid;
    wishListService.getUnitStocks(a,function(data) {

            $scope.clearTable("left-table")
            if (data.length >= 0) {
                var insertHtmlStr = '';
                for (var i = 0; i < data.length; i++) {
                    var index = i+1
                    var stockNo = data[i].cid;
                    var stockName = data[i].cname;
                    var stockNum = $scope.formatNumber(data[i].totalsa);
                    var idStr = "left" + data[i].cid.split('.')[0];
                    var marketVal = $scope.formatNumber(data[i].preclose,2);
                    var surplusNum = $scope.formatNumber(data[i].totalsa-data[i].allocatedsa);
                    var surplusVal = $scope.formatNumber((data[i].totalsa-data[i].allocatedsa)*data[i].preclose,2);
                    var tempInsertHtmlStr = '<tr class="js-left-table ui-widget-content" id="'
                                          + idStr + '"><td>'+index+'</td><td>' + stockNo + '</td><td>'
                                          + stockName + '</td><td class="js-num-left">'
                                          + stockNum + '</td><td class="js-num-left">'
                                          + marketVal + '</td><td class="js-num-left">'
                                          + surplusNum + '</td><td class="js-num-left">'
                                          +surplusVal+'</td></tr>';
                    insertHtmlStr += tempInsertHtmlStr;
                }
                if (insertHtmlStr.length > 0) {
                    //console.log("getUnitStocks insertHtmlStr--->", insertHtmlStr);
                    $(".js-left-tbody").append(insertHtmlStr);
                    //tableOperator();
                    /** 左边表格拖拽操作 */
                    $scope.dragLeftTable()
                }
            }
        $(".groupWish-view").removeClass("active");
    });
}


/**
 * @func formatNumber
 * @desc 格式化数字
 * @param {number} num 需要被格式化的数字
 * @param {int} [precision] 格式化后的精度
 * @author lizhexi
 */
$scope.formatNumber = function(num, precision) {
    var parts;
    // 判断是否为数字
    if (!isNaN(parseFloat(num)) && isFinite(num)) {
        num = Number(num);
        // 处理小数点位数
        num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
        // 分离数字的小数部分和整数部分
        parts = num.split('.');
        // 整数部分加[separator]分隔, 借用一个著名的正则表达式
        parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + ',');

        return parts.join('.');
    }
    return NaN;
}


/**
 * @func unformat
 * @desc 将加了千位符的各字符串转换为数字
 * @param {String} str 需要被转换为数字的字符串
 * @author ll
 */
$scope.unformat = function(str){
    var num =str.split(",")
    var realnum = +(num.join(''))
    return realnum;
}

/**
 * @func updateCurMaketValue
 * @desc 更新心愿清单总市值
 * @author wangxiong
 */
 $scope.updateCurMaketValue =  function() {
    var curTotalVal = 0.0;
    var rowObjs = $(".js-right-table").children();
    for (var i = 0; i < rowObjs.length; i++) {
        var rows = $(rowObjs[i]).children();
        var marketValObj = rows[4];
        var marketVal = $scope.unformat($(marketValObj).text());
        curTotalVal += parseFloat(marketVal);
        var cnameObj = rows[2];
        var cname=$(cnameObj).text();
    }
    $scope.marketPrice = curTotalVal.toFixed(2)
    var curTotalValStr = "市值:" + $scope.formatNumber(curTotalVal,2);

    $(".js-market-value").html(curTotalValStr);

}

/**
 * @func calStockUnitAmount
 * @desc 获取左侧表该股剩余股票数量
 * @author lizhexi
 */
$scope.calStockUnitAmount = function(stockNo) {
    var leftRowObj = $('#left' + stockNo);
    var leftrowObjs = $(leftRowObj).children();
    var unitAmount = $scope.unformat($(leftrowObjs[5]).text());
    return unitAmount;
}

/**
 * @func calCurUnitAmount
 * @desc 判断心愿清单某支股票数量是否超过券表中数量
 * @author lizhexi
 * @param Boolean  rlt  false-超过不可继续操作 true-未超过可继续操作
 */
$scope.calCurUnitAmount = function(stockNo, stockNum) {
    var rlt = false;
    var unitAmount = $scope.calStockUnitAmount(stockNo);
    if (stockNum >unitAmount) {
        rlt = false;
    }else{
        rlt = true;
    }
    return rlt;
}
/**
 * @func calStockUnitPrice
 * @desc 获取左侧表格指定股票单价
 * @author wangxiong
 */
$scope.calStockUnitPrice = function(stockNo) {
    var leftRowObj = $('#left' + stockNo);
    var leftrowObjs = $(leftRowObj).children();
    var unitPrice = $scope.unformat($(leftrowObjs[4]).text())
    return unitPrice;
}

/**
 * @func calCurMarketValue
 * @desc 判断心愿清单市值是否超过BP
 * @author wangxiong
 * @param Boolean  rlt  false-超过不可继续操作 true-未超过可继续操作
 */
$scope.calCurMarketValue = function(stockNo, stockNum, surplusBp) {
    var rlt = false;
    var unitPrice = $scope.calStockUnitPrice(stockNo);
    var curTotalVal = 0.0;
    var rowObjs = $(".js-right-table").children();
    for (var i = 0; i < rowObjs.length; i++) {
        var rows = $(rowObjs[i]).children();
        console.log('rows[1].text()', $(rows[1]).text())
        if (stockNo === $(rows[1]).text().split('.')[0]) {
            continue;
        }
        var marketValObj = rows[4];
        var marketVal = $scope.unformat($(marketValObj).text());
        curTotalVal += parseFloat(marketVal);
    }
    console.log(curTotalVal,stockNum,unitPrice,surplusBp)
    if (curTotalVal + stockNum * unitPrice > surplusBp) {
        rlt = false;
    }else{
        rlt = true;
    }
    return rlt;
}
/**
 * @func dealRightTableNo
 * @desc 处理右表编号
 * @author wangxiong
 */
$scope.dealRightTableNo = function() {
    var rowObjs = $(".js-right-table").children();
    for (var i = 0; i < rowObjs.length; i++) {
        var rows = $(rowObjs[i]).children();
        var rowNo = rows[0];
        $(rowNo).text(i + 1);
    }
}


/**
 * @func delayInputDeal
 * @desc 判断输入数量是否是数字。目前未判断是否为整百。可以日后改。
 * @author wangxiong
 */
$scope.delayInputDeal = function(data) {
    var curNumStr = $(data).val();
    var oldValue =$(data).attr("value");
    if(/^\d+$/.test(curNumStr)){
        /** 判断输入数量是否为正整数 */
        var dealNumStr = curNumStr.replace(/\D/g,'');
        //console.log("oldVaue-->",oldValue,"dealNumStr-->",dealNumStr);
        $(data).val(dealNumStr);
        var stockNo = $(data).parent().parent().prev().prev().text();
        //console.log("stockNo-->",stockNo)
            var tempStr = dealNumStr;
            var surBp =$(".js-surplusBp-value").text().split(':')[1];
            $scope.surplusBP = $scope.unformat(surBp);

            /** 注释掉了整手判断的条件 */
            // if (tempStr % 100 == 0) {
                 var cAmount = $scope.calCurUnitAmount(stockNo.split('.')[0], parseInt(tempStr));
                    if(cAmount){


                         var rlt = $scope.calCurMarketValue(stockNo.split('.')[0],parseInt(tempStr),$scope.surplusBP);

                            if(rlt) {
                               $(data).attr("value",dealNumStr)
                               //console.log("cAmount--->",cAmount,"rlt-->",rlt,"替换成功",$(data).attr("value"));
                            }else{
                                $(data).val(oldValue);
                                csp.notify('notice', {
                                    msg: '超出剩余杠杆BP，请重新确认数量',
                                    delay: 5000,
                                });
                                // $('.wish_list_tips').css("display","block");
                                // $scope.wishListTips = '超出剩余杠杆BP，请重新确认数量'
                                //     $('.wish_list_tips').text($scope.wishListTips)
                                //    setTimeout(function(){
                                //        $scope.wishListTips = '';
                                //        $('.wish_list_tips').css("display","none");
                                //    }, 3000);
                                //
                                console.log("超出剩余杠杆BP_input");
                            }
                        }else{
                            $(data).val(oldValue);
                            csp.notify('notice', {
                                msg: '超出券表中该支证券数量,请重新确认数量',
                                delay: 5000,
                            });
                            // $('.wish_list_tips').css("display","block");
                            // $scope.wishListTips = '超出券表中该支证券数量,请重新确认数量'
                            //     $('.wish_list_tips').text($scope.wishListTips)
                            //    setTimeout(function(){
                            //        $scope.wishListTips = '';
                            //        $('.wish_list_tips').css("display","none");
                            //    }, 3000);

                            console.log("超出券表中该支证券数量");
                        }
            // } else {
            //     //TODO modal
            //     csp.notify('notice', {
            //         msg: '请输入以100股为单位的数据',
            //         delay: 15000,
            //     });
            //     $(data).val(oldValue);
            // }
            var unitPrice = $scope.calStockUnitPrice(stockNo.split('.')[0]);
            tempStr = $(data).val();
            var curVal = $scope.formatNumber(tempStr * unitPrice,2);
            $(data).parent().parent().next().html(curVal);
            $scope.updateCurMaketValue();
    }else{
        $(data).val(oldValue);
        csp.notify('notice', {
            msg: '请输入正确格式数量',
            delay: 5000,
        });
        // $('.wish_list_tips').css("display","block");
        // $scope.wishListTips = '请输入正确格式数量'
        //     $('.wish_list_tips').text($scope.wishListTips)
        //    setTimeout(function(){
        //        $scope.wishListTips = '';
        //        $('.wish_list_tips').css("display","none");
        //    }, 3000);

    }


}

/**
 * @func tableOperator
 * @desc 操作心愿单
 * @author wangxiong
 */
$scope.tableOperator = function() {
        $scope.dragLeftTable()
        $(".js-right-row").draggable({
            cursor: "move",
            cursorAt: { top: -2, left: -2 },
            helper: "clone",
            start: function() {
                var rows = $(this).children();
                var stockNo = $(rows[1]).html();
                drapingId = stockNo.split('.')[0];
                isAddrow = false;
            }
        });
        //数量增加100
        $(".caret.up.link").unbind("click").click(function() {
            var curNumStr = $(this).parent().prev().val();
            if (curNumStr == null || curNumStr == undefined || curNumStr == '') {
                curNumStr = '0';
            }
            var stockNo = $(this).parent().parent().parent().prev().prev().html();
            var stockInput = $(this).parent().prev().val();
            console.log("curNumStr", curNumStr);
            console.log("stockNo", stockNo);
            console.log("stockInput", stockInput);
            var surBp =$(".js-surplusBp-value").text().split(':')[1];
            $scope.surplusBP = $scope.unformat(surBp);
            console.log('input',$scope.surplusBP,surBp)
             var rlt = $scope.calCurMarketValue(stockNo.split('.')[0], parseInt(stockInput) + 100, $scope.surplusBP);
             var cAmount=$scope.calCurUnitAmount(stockNo.split('.')[0], parseInt(stockInput) + 100);
            if(cAmount){
                    if (rlt) {
                        var curNum = 0;
                        curNum = parseInt(curNumStr) + 100;
                        $(this).parent().prev().val(curNum);
                        $(this).parent().prev().attr("value",curNum);
                        var unitPrice = $scope.calStockUnitPrice(stockNo.split('.')[0]);
                        var curVal = $scope.formatNumber(curNum * unitPrice,2);

                        $(this).parent().parent().parent().next().html(curVal);
                    } else {
                        //TODO 对话框

                        csp.notify('notice', {
                            msg: '超出剩余杠杆BP，请重新确认心愿清单',
                            delay: 5000,
                        });
                        // $('.wish_list_tips').css("display","block");
                        // $scope.wishListTips = '超出剩余杠杆BP，请重新确认心愿清单'
                        //   $('.wish_list_tips').text($scope.wishListTips)
                        //    setTimeout(function(){
                        //        $scope.wishListTips = '';
                        //        $('.wish_list_tips').css("display","none");
                        //    }, 3000);

                        //console.log("超出剩余杠杆");
                        console.log("数量增加失败-->", stockNo);
                    }
               }else{

                 csp.notify('notice', {
                     msg: '超出券表中该支证券数量,请重新确认数量',
                     delay: 5000,
                 });
                //  $('.wish_list_tips').css("display","block");
                //  $scope.wishListTips = '超出券表中该支证券数量,请重新确认数量'
                //    $('.wish_list_tips').text($scope.wishListTips)
                //     setTimeout(function(){
                //         $scope.wishListTips = '';
                //         $('.wish_list_tips').css("display","none");
                //     }, 3000);

                   console.log("超出券表中该支证券数量");
               }
            $scope.updateCurMaketValue();
        });

        //数量减少100
        $(".caret.down.link").unbind("click").click(function() {
            var stockNo = $(this).parent().parent().parent().prev().prev().html();
            var curNumStr = $(this).parent().prev().val();
            var curNum = 0;
                    curNum = parseInt(curNumStr) - 100;
                    if (curNum >=0) {
                        $(this).parent().prev().val(curNum);
                        $(this).parent().prev().attr("value",curNum);
                        var unitPrice = $scope.calStockUnitPrice(stockNo.split('.')[0]);
                        var curVal = $scope.formatNumber(curNum * unitPrice,2);
                        $(this).parent().parent().parent().next().html(curVal);
                    } else if (curNum >= -100) {
                        $(this).parent().prev().val(0);
                        $(this).parent().prev().attr("value",0);
                        $(this).parent().parent().parent().next().html(formatNumber(0,2));
                    }

            $scope.updateCurMaketValue();
        });

        //防止非法字符
        $("input").focus(function(){
            var inputObj = this
            var $inputObj = $(inputObj)
            var oldValue = $inputObj.attr("value")
                $inputObj.off("keyup").on("keyup",function(event) {
                    if(event.keyCode == "13"){
                      $inputObj.blur();
                   }
                 });
                    $inputObj.unbind("blur").blur(function(){
                           $scope.delayInputDeal(inputObj);


                  })

        })
        //隐藏按钮、显示按钮
        $(".input").on("mouseenter mouseleave", function(event) {
            var $me = $(this);
            if( event.type == "mouseenter"){
                $(this).children(".js-num-change").show();
            }else if(event.type == "mouseleave" ){
                 $(this).children(".js-num-change").hide();
            }
        });

        //删除记录
        $(".trash, .outline").on("click", function() {
            $(this).parent().parent().remove();
            $scope.dealRightTableNo();
            $scope.updateCurMaketValue();
        });


// //右边拖动自行处理
$(".js-right-row").droppable({
    accept:".js-right-row ",
    drop: function(event, ui) {
        if (drapingId !== undefined && drapingId !== "" && drapingId !== null) {

                //移动一条记录
                var dragRowObj = $('#right' + drapingId);
                var htmlStr = $(dragRowObj).html();
                var rowObjs = $(dragRowObj).children();
                var stockNo = $(rowObjs[1]).html();
                var stockName = $(rowObjs[2]).html();
                var stockNum1 = $(rowObjs[3]).children();
                var stockNum2 = $(stockNum1[0]).children();
                var stockNum = $(stockNum2[0]).val();
                var marketVal = $(rowObjs[4]).html();
                var idStr = "right" + drapingId;

                var insertHtmlStr = '<tr class="js-right-row" id="' + idStr + '"><td>' + 0 + '</td><td>'
                                + stockNo + '</td><td>' + stockName + '</td><td class="js-amount-right">'
                                + '<div class="ui icon input js-stock-num"><input type="text" value="'
                                + stockNum + '" ><div class="js-num-change"><i class="caret up link icon"></i>'
                                + '<i class="caret down link icon"></i></div></div></td><td class="js-num-right">'
                                + marketVal + '</td>'
                                + '<td><i class="trash outline big link icon" data-content="移除"></i>'
                                + '</td></tr>';
                var curRow = this;
                var parentObj = $(curRow);
                var pId = $(parentObj).attr("id");
                console.log("----->", pId);
                console.log("--->", 'right' + drapingId);
                if (pId == undefined || pId == "" || pId == null || pId === ('right' + drapingId)) {
                    return ;
                } else {
                    $(curRow).before(insertHtmlStr);
                    $(dragRowObj).remove();
                }
            $scope.tableOperator();
            $scope.dealRightTableNo();
        }
    }
});
}
/**
 * @func saveWishLists
 * @desc 保存用户心愿清单数据
 * @author
 */

 function wishList() {
     this.stockIndex = "";
     this.stockNo = "";
     this.stockName = "";
     this.stockNum = "";
     this.marketVal = "";
 }
$scope.saveWishLists = function() {
  var surBp =$(".js-surplusBp-value").text().split(':')[1];
  var surBp1= $scope.unformat(surBp);
  console.log('hhhhhh',surBp,surBp1);
    if( $scope.currentSelectTid  === 0){
      csp.notify('notice', {
          msg: '请先选择小组',
          delay: 5000,
      });
      // $('.wish_list_tips').css("display","block");
      // $scope.wishListTips = '请先选择小组'
      //   $('.wish_list_tips').text($scope.wishListTips)
      //    setTimeout(function(){
      //        $scope.wishListTips = '';
      //        $('.wish_list_tips').css("display","none");
      //    }, 3000);

    }else if( ($scope.marketPrice-surBp1)>0){
      console.log($scope.marketPrice,surBp1)
      csp.notify('notice', {
          msg: '心愿清单市值超过剩余杠杆BP值，不能进行该操作',
          delay: 5000,
      });
      // $('.wish_list_tips').css("display","block");
      // $scope.wishListTips = '心愿清单市值超过剩余杠杆BP值，不能进行该操作'
      //   $('.wish_list_tips').text($scope.wishListTips)
      //    setTimeout(function(){
      //        $scope.wishListTips = '';
      //        $('.wish_list_tips').css("display","none");
      //    }, 3000);

    }else{
            //获取当前表格中的值
            var wishLists = new Array();
            var stockIndex = "";
            var stockNo = "";
            var stockName = "";
            var stockNum = "";
            var valueStr = "";
            var trdate = new Date();
            var rowObjs = $(".js-right-table").children();
            for (var i = 0; i < rowObjs.length; i++) {
                var tempWishList = new wishList();
                var rows = $(rowObjs[i]).children();
                tempWishList.stockIndex = $(rows[0]).text();
                tempWishList.stockNo = $(rows[1]).text();
                tempWishList.stockName = $(rows[2]).text();
                var stockNumRowObjs = $(rows[3]).children();
                var stockNumInputObjs = $(stockNumRowObjs[0]).children();
                var stockNumObj = $(stockNumInputObjs[0]);
                var stockunitAmount = $scope.calStockUnitAmount(tempWishList.stockNo.split('.')[0]);
                tempWishList.stockNum = $(stockNumObj).val();
                if(stockunitAmount < tempWishList.stockNum){
                  csp.notify('notice', {
                      msg: '心愿清单中存在证券数量超过券表中其对应数量的',
                      delay: 5000,
                  });
                  // $('.wish_list_tips').css("display","block");
                  // $scope.wishListTips = '心愿清单中存在证券数量超过券表中其对应数量的'
                  //   $('.wish_list_tips').text($scope.wishListTips)
                  //    setTimeout(function(){
                  //        $scope.wishListTips = '';
                  //        $('.wish_list_tips').css("display","none");
                  //    }, 3000);
                  //

                    return ;
                }
                console.log("stockNumObj--->", tempWishList.stockNum);
                wishLists.push(tempWishList);
            }
            if (wishLists.length > 0) {
                var tempStr = '';
                for (var i = 0; i < wishLists.length; i++) {
                    tempStr += '("';
                    tempStr += wishLists[i].stockIndex;
                    tempStr += '","';
                    tempStr += wishLists[i].stockNo;
                    tempStr += '","';
                    tempStr += wishLists[i].stockName;
                    tempStr += '","';
                    tempStr += wishLists[i].stockNum;
                    tempStr += '","';
                    tempStr += trdate;
                    tempStr += '","';
                    tempStr += $scope.currentSelectTid;
                    tempStr += '","';

                    tempStr +=  $scope.currentSelectTrid;
                    tempStr += '"),';
                }
                if (tempStr.length > 0) {
                    valueStr = tempStr.substring(0, tempStr.length - 1);
                }
            //    console.log("valueStr", valueStr);
            }
            var a = {valueStr:'',gid:''};
            a.valueStr = valueStr;
            a.gid = $scope.currentSelectTid;
            wishListService.submitWishList(a,function(reveiveData) {
              csp.notify('notice', {
                  msg: '保存成功',
                  delay: 5000,
              });
              // $('.wish_list_tips').css("display","block");
              // $scope.wishListTips = '保存成功'
              //   $('.wish_list_tips').text($scope.wishListTips)
              //    setTimeout(function(){
              //        $scope.wishListTips = '';
              //        $('.wish_list_tips').css("display","none");
              //    }, 3000);

            });
        }
}

/**
 * @func refreshBP
 * @desc  刷新小组BP

 */
 $scope.refreshBP = function(curTid){
    console.log("curBP tid-->",curTid);
    var a = {gid:''};
    a.gid = curTid;

    wishListService.getGroupBpValue(a,function(data){
      var bpData = data.bpData
      var surplusHeaverBP = data.surplusHeaverBP


        $scope.BPvalue = parseFloat(bpData).toFixed(2);
        $scope.surplusBP = parseFloat(surplusHeaverBP).toFixed(2);



               console.log("获取BP值成功",$scope.surplusBP)
               $(".js-bp-value").html("BP:" + $scope.formatNumber($scope.BPvalue ,2));
               $(".js-surplusBp-value").html("剩余杠杆BP:" + $scope.formatNumber($scope.surplusBP ,2))

 })


}

/**
 * @func refreshGroupWish
 * @desc  刷新小组心愿清单

 */
$scope.refreshGroupWish = function(curTrid,curTid){

  var a = {gid:'',trid:''};
  a.gid = curTid;
  a.trid = curTrid;
  wishListService.getGroupWishList(a,function(data) {

            var rows = data.groupWishListdata
                $scope.clearTable("right-table")
            if (rows.length >= 0) {
                var insertHtmlStr = '';
                for (var i = 0; i < rows.length; i++) {
                    var stockNo = rows[i].cid;
                    var stockName = rows[i].cname;
                    var stockNum = rows[i].amount;
                    var stockIndex = rows[i].cindex;
                    var marketVal = $scope.formatNumber(stockNum*rows[i].preclose,2);
                    var idStr = "right" + rows[i].cid.split('.')[0];
                    var tempInsertHtmlStr = '<tr class="js-right-row" id="' + idStr + '"><td>' + stockIndex + '</td><td>'
                                    + stockNo + '</td><td>' + stockName + '</td><td class="js-amount-right">'
                                    + '<div class="ui icon input js-stock-num"><input type="text" value="'
                                    + stockNum + '" ><div class="js-num-change"><i class="caret up link icon"></i>'
                                    + '<i class="caret down link icon"></i></div></div></td><td class="js-num-right">'
                                    + marketVal + '</td>'
                                    + '<td><i class="trash outline big link icon" data-content="移除"></i>'
                                    + '</td></tr>';
                    insertHtmlStr += tempInsertHtmlStr;
                }
                if (insertHtmlStr.length > 0) {
                    $(".js-right-table").append(insertHtmlStr);
                     $scope.tableOperator();

                }

                $(".groupWish-view").removeClass("active");
            }
               $scope.updateCurMaketValue();

    });
}


})

/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */
var cspFilters = angular.module('cspFilters', []);
cspFilters.filter('', function(){
  // return function(input, tid){
  //   var output ;
  //   if (input.tid == tid){
  //     output=input;
  //   }
  //
  //   return output;
  //
  // }
})

/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */

function cspManageProductFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
		//删除掉上次的
		document.getElementById('csp_manage_product_delete_button').click();
	}
	else {
		var file = filename.substring(12);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		if(!(kind === "jpg" || kind === "png" || kind === "bmp")) {
			//error
			document.getElementById('csp_manage_product_error_button').click();
		}
		else {
			//上传
			document.getElementById('csp_manage_product_right_button').click();
		}
	}
}

function cspManageSelectFile() {
	document.getElementById("csp_manage_file_input").click();
}

function cspManageanalogProductFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
		//删除掉上次的
		document.getElementById('csp_manage_analogProduct_delete_button').click();
	}
	else {
		var file = filename.substring(12);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		if(!(kind === "jpg" || kind === "png" || kind === "bmp")) {
			//error
			document.getElementById('csp_manage_analogProduct_error_button').click();
		}
		else {
			//上传
			document.getElementById('csp_manage_analogProduct_right_button').click();
		}
	}
}

function cspModuleFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
	}
	else {
		var file = filename.substring(12);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		if(!(kind === "jpg" || kind === "png" || kind === "bmp")) {
			document.getElementById("csp_module_file_tips_label").innerText = "仅支持JPG,PNG,BMP格式的图片";
		}
		else {
			document.getElementById('csp_module_file_commit').click();
		}
	}
}

function cspManageImportLoadFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
	}
	else {
		var file = filename.substring(12);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
			document.getElementById('csp_manage_import_file_error_btn').click();
		}
		else {
			document.getElementById('csp_manage_import_file_load_btn').click();
		}
	}
}

 function cspCustomerImportLoadFileChange (obj) {
	var filename = obj.value;
	if(filename === "") {
	}
	else {
		var file = filename.substring(12);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
      console.log("yyyyyyyyyy",kind);
		}


		if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
      document.getElementById('csp_customer_import_file_error_btn').click();

		}
		// else {
		// 	document.getElementById('csp_manage_import_file_load_btn').click();
		// }
	}
}





function cspModuleImgLoad(obj) {
	if(obj.width > obj.height ) {
		obj.style.width = "auto";
		obj.style.height = "150px";
	}
	else {
		obj.style.width = "150px";
		obj.style.height = "auto";
	}
	//设置上下左右居中
	var left = (150 -obj.width)/2 + "px";
	var top = (150-obj.height)/2 + "px";
	obj.style.marginLeft = left;
	obj.style.marginTop = top;

}

function cspModuleBigImgLoad(obj) {
	console.log(window.innerWidth,window.innerHeight);
	console.log(obj.src,obj.width,obj.height);
	if(obj.width >= window.innerWidth && obj.height < window.innerHeight) {
		console.log("宽缩小，高自动");
		obj.style.width = "100%";
		obj.style.height = "auto";
	}
	if(obj.width >= window.innerWidth && obj.height >= window.innerHeight) {
		if((obj.width*1000/window.innerWidth) > (obj.height*1000/window.innerHeight)) {
			console.log("宽缩小，高自动");
			obj.style.width = "100%";
			obj.style.height = "auto";
		}
		else {
			console.log("高缩小，宽自动");
			obj.style.width = "auto";
			obj.style.height = "100%";
		}
	}
	if(obj.width < window.innerWidth && obj.height >= window.innerHeight) {
		console.log("高缩小，宽自动");
		obj.style.width = "auto";
		obj.style.height = "100%";
	}
	var left = (-obj.width)/2 + "px";
	var top = (-obj.height)/2 + "px";
	console.log(left,top);
	obj.style.marginLeft = left;
	obj.style.marginTop = top;
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
Date.prototype.Format = function(fmt)
{ //author: meizz
	var o = {
		"M+" : this.getMonth()+1,                 //月份
		"d+" : this.getDate(),                    //日
		"h+" : this.getHours(),                   //小时
		"m+" : this.getMinutes(),                 //分
		"s+" : this.getSeconds(),                 //秒
		"q+" : Math.floor((this.getMonth()+3)/3), //季度
		"S"  : this.getMilliseconds()             //毫秒
	};
	if(/(y+)/.test(fmt))
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("("+ k +")").test(fmt))
	fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	return fmt;
}

function cspManageThemesMouseOver(obj) {
	obj.style.backgroundColor = "#d5d5d5";
}

function cspManageThemesMouseOut(obj) {
	obj.style.backgroundColor = "white";
}


function getMinimum(arr){
	var min=arr[0];
	for (var i = 1; i < arr.length; i++) {
		if(min>arr[i])
			min=arr[i];
	}
	return min;
}

//主要用于图表的显示,默认
function getMaximum(arr){
	var max=arr[0];
	for (var i = 1; i < arr.length; i++) {
		if(max<arr[i])
			max=arr[i];
	}
	return max;
}

function cspManageSpotLoadFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
	}
	else {
		var file = filename.substring(12);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
			document.getElementById('csp_manage_spot_file_error_btn').click();
		}
		else {
			document.getElementById('csp_manage_spot_file_load_btn').click();
		}
	}
}

function cspManageFuturesLoadFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
	}
	else {
		var file = filename.substring(12);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
			document.getElementById('csp_manage_futures_file_error_btn').click();
		}
		else {
			document.getElementById('csp_manage_futures_file_load_btn').click();
		}
	}
}

function loadStockFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
		document.getElementById('stockfile_error_btn').click();
	}
	else {
		// var file = filename.substring(12);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		else {
			document.getElementById('stockfile_error_btn').click();
		}

		if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
			document.getElementById('stockfile_error_btn').click();
		}
		else {
			document.getElementById('stockfile_load_btn').click();
		}
	}
}

//分页算法,current表示当前的，length表示总的页数，displayLength表示一次显示的分页数
function calculateIndexes(current, length, displayLength) {
 var indexes = [];
	current=current>length?length:current;

 var start = Math.round(current - displayLength / 2);
 var end =   Math.round(current + displayLength / 2);
 console.log('start',start,'end',end);
 if (start < 1) {
		 start = 1;
 }
 if (end !=start+displayLength-1) {
		 end = start+displayLength - 1 ;
 }
 if(end>length)
	 end=length;

 if(end-displayLength+1<start){
	 start=end-displayLength+1>0?end-displayLength+1:1;
 }

 for (var i = start; i <= end; i++) {
	 var obj={};
	 obj.page=i;
	 if (i==current) {
		 obj.select=true;
	 }else {
		 obj.select=false;
	 }
	 indexes.push(obj);
 }
 console.log(indexes);
 return indexes;
 }

 //操作登录界面背景图片
 function cspOperLoginBgChange() {
	 if(window.innerHeight <= 400) {
		 document.getElementById("csp_oper_login_html").style.height = "400px";
	 }
	 else {
		 document.getElementById("csp_oper_login_html").style.height = "100%";
	 }
 }



 //新建公告选择文件
 function cspManageNewNoticeFileChange(obj) {
	 var filename = obj.value;
 	if(filename === "") {
 		//删除掉上次的
 		document.getElementById('csp_manage_newnotice_file_delete_button').click();
 	}
 	else {
 		var file = filename.substring(12);
 		var filekindarr = filename.split(".");
 		var kind = "";
 		if(filekindarr.length > 1) {
 			kind = filekindarr[filekindarr.length -1].toLowerCase();
			if(kind === "pdf") {
				document.getElementById('csp_manage_newnotice_file_right_button').click();
			}
 		}
 	}
 }

 //导入用户选择文件
 function cspManageLoadUserLoadFileChange(obj) {
	 var filename = obj.value;
 	if(filename === "") {
 	}
 	else {
 		var file = filename.substring(12);
 		var filekindarr = filename.split(".");
 		var kind = "";
 		if(filekindarr.length > 1) {
 			kind = filekindarr[filekindarr.length -1].toLowerCase();
 		}
 		if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
 			document.getElementById('csp_manage_futures_file_error_btn').click();
 		}
 		else {
 			document.getElementById('csp_manage_futures_file_load_btn').click();
 		}
 	}
 }

 //导入已购产品选择文件
 function cspManageLoadBoughtLoadFileChange(obj) {
	 var filename = obj.value;
   	 if(filename === "") {
     }
   	 else {
	    var file = filename.substring(12);
	    var filekindarr = filename.split(".");
	    var kind = "";
	    if(filekindarr.length > 1) {
		    kind = filekindarr[filekindarr.length -1].toLowerCase();
	    }
	    if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
		    document.getElementById('csp_manage_loadbought_file_error_btn').click();
	    }
	    else {
		    document.getElementById('csp_manage_loadbought_file_load_btn').click();
	    }
    }
 }


 //传入最大值,返回设置图表的最大值和分段间隔
 var getMaxAndInterval = function(max)
 {
 	var splitNumber=5;//分割的块数
 	var interval=max/splitNumber;
 	var newinterval = interval;
 	var n = 0;

 	//获取数的十为底的次数,1为0,0.1为0
 	if(interval < 1)
 	{
 		var n = 1;
 		while(interval < 1)
 		{
 			interval = interval*10;
 			n = n - 1;
 		}
 	}
 	else
 	{
 		while(interval >= 1)
 		{
 			interval = interval/10;
 			n = n + 1;
 		}
 	}
 	console.log('n',n);

 	newinterval = Math.ceil(newinterval/Math.pow(10,n-1))*Math.pow(10,n-1);

 	if (Math.abs(n)+1<=20) {
 		n=Math.abs(n)+1;
 	}
	else{
		n=20;
	}
 	newinterval = parseFloat(newinterval.toFixed(n));

 	if(max >= newinterval*splitNumber - 0.5*newinterval)
 	{
 		max = newinterval * (splitNumber + 1);
 		splitNumber = splitNumber + 1;
 	}
 	else
 	{
 		max = newinterval*splitNumber;
 	}
	max = parseFloat(max.toFixed(n));

 	var obj={};
 	obj.max=max;
 	obj.interval=newinterval;

 	return obj;
 }

/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */

/**
 * 配置路由。
 * 注意这里采用的是ui-router这个路由，而不是ng原生的路由。
 * ng原生的路由不能支持嵌套视图，所以这里必须使用ui-router。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
var cspRouters = angular.module('cspRouters', ['ui.router']);

cspRouters.config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/operlogin');
  $stateProvider
 
    .state('operlogin',{
      url:'/operlogin',
      views:{
        '':{
          templateUrl: 'tpls/securitiesManage/operLogin.html'
        }
      }
    })
    .state('allocateStock',{
      url:'/allocateStock',
      views:{
        '':{
          templateUrl: 'tpls/allocateStock/index.html'
        }
      }
    })
    .state('tradeTeamManage',{
      url:'/tradeTeamManage',
      views:{
        '':{
          templateUrl: 'tpls/allocateStock/tradeTeamManageIndex.html'
        }
      }
    })
    .state('opermanage',{
      url:'/opermanage',
      views:{
        '':{
          templateUrl: 'tpls/operManage/index.html'
        }
      }
    })

    .state('layoutmanage',{
        url:'/layoutmanage',
        views:{
            '':{
                templateUrl: 'tpls/layoutmanage/index.html'
            }
        }
    })

    .state('unitManage',{
      url:'/unitManage',
      views:{
        '':{
          templateUrl: 'tpls/unitManage/index.html'
        }
      }
    })

    .state('wishList',{
      url:'/wishList',
      views:{
        '':{
          templateUrl: 'tpls/wishList/index.html'
        }
      }
    })
    .state('groupexchange',{
      url:'/groupexchange',
      views:{
        '':{
          templateUrl: 'tpls/groupexchange/index.html'
		}
	   }
	})

    .state('random',{
      url:'/random',
      views:{
        '':{
          templateUrl: 'tpls/random/index.html'
        }
      }
    })

    .state('importStockData',{
      url:'/importStockData',
      views:{
        '':{
          templateUrl: 'tpls/importStockData/index.html'
        }
      }
    })
    .state('operloginout',{
      url:'/operloginout',
      views:{
        '':{
          templateUrl: 'tpls/operloginout/index.html'
        }
      }
    })
})

/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */
var cspServices = angular.module('cspServices', []);



cspServices.factory('allocateStockService',function($http) {
	var service = {};


  	service.getModel=function(params,callback){

  		$http({
  			url:'/tradeTeamManage/getModel',
  			params: params,
  			method: 'GET'
  		}).success(function(res){
  			console.log(res);
  			callback(res);
  		}).error(function(res) {
  			var pro = {};
  			pro.result=false;
  			pro.reason='获取交易单元失败';
  			callback(pro);
  		});
  	}


//获取指定交易单元下未被分组的交易员
		service.getTradersNotInTeams=function(params,callback){

			$http({
				url:'/tradeTeamManage/getTradersNotInTeams',
				params: params,
				method: 'GET'
			}).success(function(res){
				console.log(res);
				callback(res);
			}).error(function(res) {
				var pro = {};
				pro.result=false;
				pro.reason='获取指定交易单元下未被分组的交易员失败';
				callback(pro);
			});
		}

//获取指定交易单元下未分组和在特定小组的成员信息
		service.getTradersForEdit=function(params,callback){

			$http({
				url:'/tradeTeamManage/getTradersForEdit',
				params: params,
				method: 'GET'
			}).success(function(res){
				console.log(res);
				callback(res);
			}).error(function(res) {
				var pro = {};
				pro.result=false;
				pro.reason='获取getTradersForEdit交易员失败';
				callback(pro);
			});
		}

//获取指定小组的小组成员及小组组长信息
		service.getTeamTraders=function(params,callback){

			$http({
				url:'/tradeTeamManage/getTeamTraders',
				params: params,
				method: 'GET'
			}).success(function(res){
				console.log(res);
				callback(res);
			}).error(function(res) {
				var pro = {};
				pro.result=false;
				pro.reason='获取指定小组的小组成员及小组组长信息失败';
				callback(pro);
			});
		}

		//新建小组数据库数据插入
				service.addNewTeam=function(params,callback){

					$http({
						url:'/tradeTeamManage/addNewTeam',
						params: params,
						method: 'POST'
					}).success(function(res){
						console.log(res);
						callback(res);
					}).error(function(res) {
						var pro = {};
						pro.result=false;
						pro.reason='新建小组数据插入失败';
						callback(pro);
					});
				}
				//获取交易单元下小组详细信息
						service.teamsInfo=function(params,callback){

							$http({
								url:'/tradeTeamManage/teamsInfo',
								params: params,
								method: 'GET'
							}).success(function(res){
								console.log(res);
								callback(res);
							}).error(function(res) {
								var pro = {};
								pro.result=false;
								pro.reason='获取交易单元下小组详细信息';
								callback(pro);
							});
						}





//确认编辑小组按钮
		service.editTeamConfirm=function(params,callback){

			$http({
				url:'/tradeTeamManage/editTeamConfirm',
				params: params,
				method: 'POST'
			}).success(function(res){
				console.log(res);
				callback(res);
			}).error(function(res) {
				var pro = {};
				pro.result=false;
				pro.reason='确认编辑小组失败';
				callback(pro);
			});
		}
//确认删除小组信息

service.delGid=function(params,callback){

	$http({
		url:'/tradeTeamManage/delGid',
		params: params,
		method: 'POST'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='确认删除小组信息失败';
		callback(pro);
	});
}
  return service;
});


cspServices.factory('operLoginService',function($http) {
	var service = {};
	service.cspOperCheckLogin = function(params,callback) {
		$http({
			url:'/operlogin/checklogin',
	        params: params,
	        method: 'POST'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	service.cspOperLogin = function(params,callback) {
		$http({
			url:'/operlogin/login',
	        params: params,
	        method: 'POST'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	//判断登录及自动登录 参数
	// {
	// 	cookieExist : true / false, 表示是否传递了cookie信息，若为false，则不需要传递后三个字段
	// 	login_maid : "x",
	// 	login_oid : "x", //此处login_oid 与数据库中的不同
	// 	login_pass: "x"
	// }
	service.cspOperCheckAndLogin = function(params,callback) {
		$http({
			url:'/operlogin/checkandlogin',
	        params: params,
	        method: 'POST'
		}).success(function(res) {
			callback(res); //仅当result值为succeed时，表示登录成功
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	//验证身份证号码
	service.cspOperCheckIdcard = function(params) {
		var sId = params;
		var city={
			11:"北京",
			12:"天津",
			13:"河北",
			14:"山西",
			15:"内蒙古",
			21:"辽宁",
			22:"吉林",
			23:"黑龙江",
			31:"上海",
			32:"江苏",
			33:"浙江",
			34:"安徽",
			35:"福建",
			36:"江西",
			37:"山东",
			41:"河南",
			42:"湖北",
			43:"湖南",
			44:"广东",
			45:"广西",
			46:"海南",
			50:"重庆",
			51:"四川",
			52:"贵州",
			53:"云南",
			54:"西藏 ",
			61:"陕西",
			62:"甘肃",
			63:"青海",
			64:"宁夏",
			65:"新疆",
			71:"台湾",
			81:"香港",
			82:"澳门",
			91:"国外 "};
		var iSum=0 ;
	    var info="" ;
	 	if(!/^\d{17}(\d|x)$/i.test(sId)) return false;
	 	sId=sId.replace(/x$/i,"a");
	 	if(city[parseInt(sId.substr(0,2))]==null) return false;
	 	var sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
	 	var d=new Date(sBirthday.replace(/-/g,"/")) ;
	 	if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())) return false;
	 	for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
	 	if(iSum%11!=1) return false;
	 	//aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
	 	return true;
	}

	//判断操作员是否是某个交易单元的组长,同时返回交易单元
	// 参数传递
	// {
	// 	useparams: 0, //0表示不使用传递的参数，改成使用session中的maid 和 oid，若要使用参数，将该字段值设为1
	// 	oid: "1.1"
	// }
	service.cspOperCheckGroupAndGetList = function(params,callback) {
		$http({
			url:'/operlogin/checkgroupandgetlist',
	        params: params,
	        method: 'GET'
		}).success(function(res) {
			callback(res); //仅当result值为succeed时，表示登录成功
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}

	service.cspOperLoginOut = function(params,callback) {
		$http({
			url:'/operlogin/loginout',
	        params: params,
	        method: 'POST'
		}).success(function(res) {
			callback(res); //仅当result值为succeed时，表示登录成功
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}

	return service;
})


cspServices.factory('operManageService',function($http) {
	var service = {};
	service.cspOperManageGetAllMaid = function(params,callback) {
		$http({
			url:'/opermanage/getallmaid',
	        params: params,
	        method: 'GET'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	service.cspOperManageGetOidByMaid = function(params,callback) {
		$http({
			url:'/opermanage/getoidbymaid',
	        params: params,
	        method: 'GET'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	service.cspOperManageGetOperByOid = function(params,callback) {
		$http({
			url:'/opermanage/getoperbyoid',
	        params: params,
	        method: 'GET'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	service.cspOperManageAddOper = function(params,callback) {
		$http({
			url:'/opermanage/addoper',
	        params: params,
	        method: 'POST'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	service.cspOperManageUpdateOper = function(params,callback) {
		$http({
			url:'/opermanage/updateoper',
	        params: params,
	        method: 'POST'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	service.cspOperManageChangeOperStat = function(params,callback) {
		$http({
			url:'/opermanage/changeoperstat',
	        params: params,
	        method: 'POST'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	service.cspOperManageResetPass = function(params,callback) {
		$http({
			url:'/opermanage/resetpass',
	        params: params,
	        method: 'POST'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	//通过资产管理人获取资产单元
	service.cspOperManageGetCaidByMaid = function(params,callback) {
		$http({
			url:'/opermanage/getcaidbymaid',
	        params: params,
	        method: 'GET'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}

	//通过资产单元获取交易单元
	service.cspOperManageGetTridByCaid = function(params,callback) {
		$http({
			url:'/opermanage/gettridbycaid',
	        params: params,
	        method: 'GET'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}

	//添加交易员
	service.cspOperManageAddTrader = function(params,callback) {
		$http({
			url:'/opermanage/addtrader',
	        params: params,
	        method: 'POST'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	return service;
})



cspServices.factory('randomService',function($http) {
	var service = {};



//获取交易单元下的小组
service.getWishTid=function(params,callback){

	$http({
		url:'/random/getWishTid',
		params: params,
		method: 'GET'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='获取交易单元下的小组失败';
		callback(pro);
	});
}

service.unitRandmDiv=function(params,callback){

	$http({
		url:'/random/unitRandmDiv',
		params: params,
		method: 'POST'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='分券失败';
		callback(pro);
	});
}
service.deleResults=function(params,callback){

	$http({
		url:'/random/deleResults',
		params: params,
		method: 'POST'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='清除分券结果失败';
		callback(pro);
	});
}
service.writeResults=function(params,callback){

	$http({
		url:'/random/writeResults',
		params: params,
		method: 'POST'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='写入分券结果失败';
		callback(pro);
	});
}
service.writeSec=function(params,callback){

	$http({
		url:'/random/writeSec',
		params: params,
		method: 'POST'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='更改总券失败';
		callback(pro);
	});
}
service.recoverStock=function(params,callback){

	$http({
		url:'/random/recoverStock',
		params: params,
		method: 'POST'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='恢复总券失败';
		callback(pro);
	});
}
service.noWishList=function(params,callback){

	$http({
		url:'/random/noWishList',
		params: params,
		method: 'GET'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='获取是否所有小组均没有心愿清单失败';
		callback(pro);
	});
}

service.deleWishList=function(params,callback){

	$http({
		url:'/random/deleWishList',
		params: params,
		method: 'POST'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='分券完毕后删除心愿清单失败';
		callback(pro);
	});
}
service.getRandmR=function(params,callback){

	$http({
		url:'/random/getRandmR',
		params: params,
		method: 'GET'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='分券完毕后获取分券结果失败';
		callback(pro);
	});
}


service.randomOver=function(params,callback){

	$http({
		url:'/random/randomOver',
		params: params,
		method: 'GET'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='分券完毕后检查总券是否有剩余券失败';
		callback(pro);
	});
}

service.getTname=function(params,callback){

	$http({
		url:'/random/getTname',
		params: params,
		method: 'GET'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='根据小组gid获取小组名称失败';
		callback(pro);
	});
}



service.getInfobyGid=function(params,callback){

	$http({
		url:'/random/getInfobyGid',
		params: params,
		method: 'GET'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='根据小组gid获取小组杠杆/分券市值失败';
		callback(pro);
	});
}

  return service;
});




cspServices.factory('tradeUnitStockService',function($http) {
	var service = {};

	service.getStocksByTrade=function(params,callback){

    $http({
      url:'/tradeUnitStockService/getStocksByTrade',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='获取所有资产单元失败';
      callback(pro);
    });
  }

	service.loadStockFile=function(params,callback){

		$http({
			url:'/tradeUnitStockService/loadStockFile',
			data: params,
			method: 'POST',
			headers: {'Content-Type':undefined},
			transformRequest: angular.identity
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='上传券表文件失败';
			callback(pro);
		});
	}

	service.importStock=function(params,callback){

    $http({
      url:'/tradeUnitStockService/importStock',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='获取所有资产单元失败';
      callback(pro);
    });
  }

	service.saveEditStock=function(params,callback){

    $http({
      url:'/tradeUnitStockService/saveEditStock',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='编辑券表数据失败';
      callback(pro);
    });
  }
	service.delStock=function(params,callback){

		$http({
			url:'/tradeUnitStockService/delStock',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='删除券表数据失败';
			callback(pro);
		});
	}

	service.getStockAmountByTrade=function(params,callback){

		$http({
			url:'/tradeUnitStockService/getStockAmountByTrade',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='获取券表数量失败';
			callback(pro);
		});
	}


	service.createStock=function(params,callback){

		$http({
			url:'/tradeUnitStockService/createStock',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='创建券表数据失败';
			callback(pro);
		});
	}

	service.loadStockFileAndImport=function(params,callback){

		$http({
			url:'/tradeUnitStockService/loadStockFileAndImport',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='导入数据失败';
			callback(pro);
		});
	}


  return service;
});




cspServices.factory('unitManageService',function($http) {
	var service = {};

  service.getValidAssetUnit=function(params,callback){

    $http({
      url:'/unitManageService/getValidAssetUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='获取所有资产单元失败';
      callback(pro);
    });
  }

  service.getTotalAssetUnit=function(params,callback){

    $http({
      url:'/unitManageService/getTotalAssetUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='获取所有资产单元失败';
      callback(pro);
    });
  }

  service.getAssetUnitFromCapManager=function(params,callback){

    $http({
      url:'/unitManageService/getAssetUnitFromCapManager',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='获取所有资产单元失败';
      callback(pro);
    });
  }




  service.getAllValidCapManager=function(params,callback){

    $http({
      url:'/unitManageService/getAllValidCapManager',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='获取所有有效的资产管理人失败';
      callback(pro);
    });
  }

  service.getAllCapManager=function(params,callback){

    $http({
      url:'/unitManageService/getAllCapManager',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='获取所有资产管理人失败';
      callback(pro);
    });
  }

  service.saveEditAssetUnit=function(params,callback){

    $http({
      url:'/unitManageService/saveEditAssetUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='编辑资产单元失败';
      callback(pro);
    });
  }

  service.createAssetUnit=function(params,callback){

    $http({
      url:'/unitManageService/createAssetUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='创建资产单元失败';
      callback(pro);
    });
  }

	service.saveEditAssetManager=function(params,callback){

    $http({
      url:'/unitManageService/saveEditAssetManager',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='编辑资产管理人失败';
      callback(pro);
    });
  }

  service.createAssetManager=function(params,callback){

    $http({
      url:'/unitManageService/createAssetManager',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='创建资产管理人失败';
      callback(pro);
    });
  }

	service.saveEditTradeUnit=function(params,callback){

    $http({
      url:'/unitManageService/saveEditTradeUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='编辑交易单元失败';
      callback(pro);
    });
  }

  service.createTradeUnit=function(params,callback){

    $http({
      url:'/unitManageService/createTradeUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='创建交易单元失败';
      callback(pro);
    });
  }

  service.getTransUnitFromAssetUnit=function(params,callback){

		$http({
			url:'/unitManageService/getTransUnitFromAssetUnit',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='获取所有交易单元失败';
			callback(pro);
		});
	}


  service.getAllAssetManagers=function(params,callback){

		$http({
			url:'/unitManageService/getAllAssetManagers',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='获取所有资产管理人失败';
			callback(pro);
		});
	}

	service.getAllAssetUnits=function(params,callback){

		$http({
			url:'/unitManageService/getAllAssetUnits',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='获取所有资产管理人失败';
			callback(pro);
		});
	}

	service.getAllAssetTraders=function(params,callback){

		$http({
			url:'/unitManageService/getAllAssetTraders',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='获取所有资产管理人失败';
			callback(pro);
		});
	}

  service.frozenAssetManager=function(params,callback){

    $http({
      url:'/unitManageService/frozenAssetManager',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='冻结资产管理人失败';
      callback(pro);
    });
  }

  service.frozenAssetUnit=function(params,callback){

    $http({
      url:'/unitManageService/frozenAssetUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='冻结资产单元失败';
      callback(pro);
    });
  }

  service.frozenTradeUnit=function(params,callback){

    $http({
      url:'/unitManageService/frozenTradeUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='冻结交易单元失败';
      callback(pro);
    });
  }

  service.unfreezeAssetManager=function(params,callback){

    $http({
      url:'/unitManageService/unfreezeAssetManager',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='解冻资产管理人失败';
      callback(pro);
    });
  }

  service.unfreezeAssetUnit=function(params,callback){

    $http({
      url:'/unitManageService/unfreezeAssetUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='解冻资产单元失败';
      callback(pro);
    });
  }

  service.unfreezeTradeUnit=function(params,callback){

    $http({
      url:'/unitManageService/unfreezeTradeUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='解冻交易单元失败';
      callback(pro);
    });
  }

	service.getNewManagerid=function(params,callback){

		$http({
			url:'/unitManageService/getNewManagerid',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='解冻交易单元失败';
			callback(pro);
		});
	}

	service.getNewCaid=function(params,callback){

		$http({
			url:'/unitManageService/getNewCaid',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='解冻交易单元失败';
			callback(pro);
		});
	}

	service.getNewTrid=function(params,callback){

		$http({
			url:'/unitManageService/getNewTrid',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='解冻交易单元失败';
			callback(pro);
		});
	}


  return service;
})



cspServices.factory('wishListService',function($http) {
	var service = {};


	service.getTidModel=function(params,callback){

		$http({
			url:'/wishList/getTidModel',
			params: params,
			method: 'GET'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='获取交易小组失败';
			callback(pro);
		});
	}


service.getUnitStocks=function(params,callback){

	$http({
		url:'/wishList/getUnitStocks',
		params: params,
		method: 'GET'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='获取交易单元券表失败';
		callback(pro);
	});
}

//保存心愿清单
service.submitWishList=function(params,callback){

	$http({
		url:'/wishList/submitWishList',
		params: params,
		method: 'POST'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='保存心愿清单失败';
		callback(pro);
	});
}


//获取小组总BP
service.getGroupBpValue=function(params,callback){

	$http({
		url:'/wishList/getGroupBpValue',
		params: params,
		method: 'GET'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='获取小组总BP失败';
		callback(pro);
	});
}


//获取小组心愿清单
service.getGroupWishList=function(params,callback){

	$http({
		url:'/wishList/getGroupWishList',
		params: params,
		method: 'GET'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='获取小组心愿清单失败';
		callback(pro);
	});
}
  return service;
});
