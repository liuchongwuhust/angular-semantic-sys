/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */
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
