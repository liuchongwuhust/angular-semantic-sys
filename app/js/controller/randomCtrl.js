/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */
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
