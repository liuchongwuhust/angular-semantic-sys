/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */

var $util = require('../util/util.js');
var sql = {};



sql.unitRandmDiv = function(req, res){

  var trid = req.query.trid;

  /**
   * @desc 全局信息
   *itemPreDiv   总券中每一只股票的信息
   *unitWishPre  每一个资产单元的小组的心愿
   *bpData      小组bp
   *lastInfoE   上次换券结果gid对应的Index
   *lastInfo   上次分券结果gid对应的index
   */
  var itemPreDiv=[];
  var unitWishPre=[];
  var bpData=[];
  var UnitWish=[];
  var ItemPreDiv=[];
  var lastInfo=[];
  var lastInfoE=[];

  /**
  * @desc 克隆一个对象
  * @param[in] obj 传入的对象
  * @return 克隆后的对象
  */
  function clone(obj){
      var o;
      if (typeof obj == "object") {
          if (obj === null) {
              o = null;
          } else {
              if (obj instanceof Array) {
                  o = [];
                  for (var i = 0, len = obj.length; i < len; i++) {
                      o.push(clone(obj[i]));
                  }
              } else {
                  o = {};
                  for (var j in obj) {
                      o[j] = clone(obj[j]);
                  }
              }
          }
      } else {
          o = obj;
      }
      return o;
  }
  /**
  * @brief 对A数组的随机排序
  * @author ll
  * @param[in] obj 传入的对象
  * @return 返回的排序的序列
  */
  function randomSort(A){
      var a=[];
      for(var m=0;m<A.length;m++){
       a[m]=m;
      };
      a.sort(function(){ return 0.5 - Math.random() });
      return a;
  }
  /**
  * @brief 找出UnitWish中心愿最大数
  * @author ll
  * @param[in] obj 传入的对象
  * @return 返回最大数
  */
 function maxLength(UnitWish){
      var max=0;
      for(var i=0;i<UnitWish.length;i++){
          if(UnitWish[i].children.length>max){
              max=UnitWish[i].children.length;
          }
      }
      return max;
  }

  Step.Step(function(data){
      lastInfo=[];
      var that=this;
      var sql='SELECT * FROM ( SELECT a.`cid`, a.`cname`, a.`totalsa`, a.`allocatedsa`, b.`preclose`,b.`trday`'
             +' FROM csp_stock AS a, ( select max(trday) as trday,cid ,preclose from (select * from csp_tsmdclear AS b order by trday desc) b group by  cid) as b '
             +'WHERE b.`cid` = a.`cid`  AND (a.`totalsa`- a.`allocatedsa`)<>0 AND a.`trid` = "'
             + trid +'" ORDER BY a.`cid` ASC) AS aaa  '
             +'UNION SELECT * FROM( SELECT a.`cid`, a.`cname`, a.`totalsa`, a.`allocatedsa`, b.`preclose`,b.`trday`'
             +'FROM csp_stock AS a,  ( select max(trday) as trday,cid ,preclose from (select * from csp_tsmdclear AS b order by trday desc) b group by  cid) as b '
             +' WHERE b.`cid` = a.`cid` AND (a.`totalsa`- a.`allocatedsa`)=0 AND a.`trid` = "'
             + trid +'" ORDER BY a.`cid` ASC) AS bbb'
       csp.db.query(sql,function(err,data){
           itemPreDiv=data;
           console.log(itemPreDiv);
           that.step(itemPreDiv);
       })
  },function(data){
    var that=this;
    ItemPreDiv=clone(itemPreDiv);
    console.log("总券获取成功：代码/名字/剩余数量/每股市值",JSON.stringify(ItemPreDiv));
    that.step(ItemPreDiv);
  },function(data){
    var that=this;
    var sql_bp="SELECT SUM(t.bp*t.bp_heaver) AS bp,i.* FROM `csp_tradergroup` AS m LEFT JOIN `csp_tstrader` AS t ON m.traderid = t.traderid  LEFT JOIN `csp_group` AS i ON m.gid = i.gid  GROUP BY m.gid"
        csp.db.query(sql_bp,function(err,data){
            bpData=data;
            console.log("获gid的杠杆bp",bpData)
            that.step(bpData)
        })
  },function(bpData){
    var that=this;
    unitWishPre=[];
    var sql_wish = "select gid,cindex,cid,cname,amount from csp_wishlist where trid='"+trid+"' order by gid,cindex*1"
    csp.db.query(sql_wish, function(err, data) {
    var length = data.length
    var gidPre = ''
    var indexGid = -1
    var indexCindex = -1
    for(var i=0; i<length; i++){
        if(gidPre !== data[i].gid){
            indexGid++
            gidPre = data[i].gid
            var itemgid = {gid:'',gid_bp:'',allocated_sum_value:'', children:[]}
            itemgid.gid=data[i].gid
            itemgid.allocated_sum_value=0;
            for(var j=0;j<bpData.length;j++){
                if(data[i].gid==bpData[j].gid)
                {
                    itemgid.gid_bp=bpData[j].bp;
                    break;
                }
            }
            unitWishPre[indexGid] = itemgid
            indexCindex = -1
        }
        indexCindex++
        var itemGroup={cindex:'',cid:'',cname:'',amount:'',allocated_value:'',post_allocated_amount:''}
        itemGroup.cindex=data[i].cindex;
        itemGroup.cid=data[i].cid;
        itemGroup.cname=data[i].cname;
        itemGroup.amount=data[i].amount;

        itemGroup.allocated_value=0;
        itemGroup.post_allocated_amount=0;
        unitWishPre[indexGid].children[indexCindex] = itemGroup;

    }
     console.log("成功获取心愿清单的数据", JSON.stringify(unitWishPre));
     that.step(unitWishPre);
    })

  },function(){
    var that =this;

    var len=unitWishPre.length;
    for(var i=0;i<unitWishPre.length;i++){
       (function(a){
            var sqlu="select IFNULL(MAX(cindex+1), 1) as maxCindex,gid FROM csp_random_allocated_results WHERE gid = '"+unitWishPre[a].gid+"'";

            csp.db.query(sqlu,function(err,data){
                var itemGid={gid:'',maxCindex:''};
                itemGid.gid=unitWishPre[a].gid;
                itemGid.maxCindex=parseInt(data[0].maxCindex);
               //  console.log("itemTid",itemTid);
                lastInfo[a]=itemGid;
                len--;
                handle();
            })
        })(i)
    }
       function handle() {
           if (len === 0) {
               console.log("lastInfo",JSON.stringify(lastInfo));
               that.step();
           }
       }

  },function(){
    //查询之前的分配结果，将心愿清单完善
    var that=this;

    var sql="select gid,cindex,cid,post_allocated_amount,post_allocated_value from csp_random_allocated_results where trid='"+trid+"'";
    csp.db.query(sql,function(err,data){
        for(var i=0;i<unitWishPre.length;i++){
           for(var j=0;j<unitWishPre[i].children.length;j++){
               var flag=0;
               for(var k=0;k<data.length;k++){
                   if(unitWishPre[i].gid===data[k].gid){
                       if(unitWishPre[i].children[j].cid===data[k].cid){
                           unitWishPre[i].children[j].post_allocated_amount=Number(data[k].post_allocated_amount);
                           unitWishPre[i].children[j].cindex=parseInt(data[k].cindex);
                           console.log("data[k].cindex",data[k].cindex);
                           console.log("unitWishPre[i].children[j].cindex",unitWishPre[i].children[j].cindex);
                           flag=1;
                       }
                   }
               }
               if(!flag){
                   for(var m=0;m<lastInfo.length;m++){
                       if(unitWishPre[i].gid===lastInfo[m].gid){
                          unitWishPre[i].children[j].cindex=lastInfo[m].maxCindex;
                          lastInfo[m].maxCindex=lastInfo[m].maxCindex+1;
                          console.log("unitWishPre[i].children[j].cindex--",unitWishPre[i].children[j].cindex);
                          break;
                       }
                   }
               }

           }

       }
       that.step()
   })
 },function(){
   var that=this;
   var sql;
   sql="select SUM(post_allocated_value) as sum_value,gid from csp_random_allocated_results group by gid";
  csp.db.query(sql,function(err,data){
      for(var i=0;i<unitWishPre.length;i++){
          for(var j=0;j<data.length;j++){
              if(unitWishPre[i].gid===data[j].gid){
                  unitWishPre[i].allocated_sum_value=data[j].sum_value;
              }
          }

      }


  that.step();
  })
},function(data){
  /*
  *分券
  */
  var that=this;

/*
*查询某个心愿对应的总券剩余数量是否为0;
*返回 1 为非0, 返回0 为 0;
*/
  function surplusAmount(a,b){
    for (var k = 0; k < b.length; k++){
      if(a.cname === b[k].cname){
        var surplus_amount = b[k].totalsa -b[k].allocatedsa;
        if(surplus_amount){
          return 1
        }else {
          return 0;
        }
      }
    }
  }

  console.log('unitWishPre',JSON.stringify(unitWishPre));
  UnitWish= clone(unitWishPre);
  // console.log("分券之前小组心愿数组",JSON.stringify(UnitWish))
  var maxUnitWishLength=maxLength(UnitWish);
  for(var i=0;i<maxUnitWishLength;i++){
  //给这一轮的小组随机排序---满足心愿的顺序
  console.log("第 "+i+" 轮小组心愿清单 ")
  var a=randomSort(UnitWish);

  for(var j=0;j<a.length;j++){
      var aj=a[j];
      console.log("判断---",typeof(UnitWish[aj].children[i]));

      if(UnitWish[aj].children[i]!=undefined){
          var wish_length = UnitWish[aj].children.length;
          var surplus_amount = surplusAmount(UnitWish[aj].children[i],ItemPreDiv);

          while (surplus_amount == 0 && i<UnitWish[aj].children.length-1) {
            UnitWish[aj].children.splice(i,1);
            surplus_amount = surplusAmount(UnitWish[aj].children[i],ItemPreDiv)
          }


          if(UnitWish[aj].children[i]!=undefined){

                for (var k = 0; k < ItemPreDiv.length; k++) {
                    if (UnitWish[aj].children[i].cname===ItemPreDiv[k].cname) {
                        if (ItemPreDiv[k].totalsa-ItemPreDiv[k].allocatedsa > UnitWish[aj].children[i].amount) {
                            UnitWish[aj].children[i].post_allocated_amount +=Number(UnitWish[aj].children[i].amount) ;
                            UnitWish[aj].children[i].allocated_value = Number(UnitWish[aj].children[i].post_allocated_amount) *Number(ItemPreDiv[k].preclose);
                            UnitWish[aj].allocated_sum_value+=Number(UnitWish[aj].children[i].allocated_value);
                            ItemPreDiv[k].allocatedsa =Number(ItemPreDiv[k].allocatedsa)+ Number(UnitWish[aj].children[i].amount);
                            }
                        else if (ItemPreDiv[k].totalsa-ItemPreDiv[k].allocatedsa <= UnitWish[aj].children[i].amount) {

                            UnitWish[aj].children[i].post_allocated_amount+= Number(ItemPreDiv[k].totalsa-ItemPreDiv[k].allocatedsa);
                            UnitWish[aj].children[i].allocated_value = Number(UnitWish[aj].children[i].post_allocated_amount) *Number(ItemPreDiv[k].preclose);
                            UnitWish[aj].allocated_sum_value+=Number(UnitWish[aj].children[i].allocated_value);
                            ItemPreDiv[k].allocatedsa = ItemPreDiv[k].totalsa;
                            }

                                 break;
                            }
                         }
          }
      }

  }


}//小组愿望清单分配完


      that.step();
},function(data){
  var that=this;
  //将之前无法满足的愿望也要加入最后的结果进行显示
  for(var i =0;i<unitWishPre.length;i++){
    while(unitWishPre[i].children.length>UnitWish[i].children.length){
      for(var j = 0;j<unitWishPre[i].children.length;j++){
        var length = UnitWish[i].children.length;
        if(j+1>length){
          for(var d = j;d<unitWishPre[i].children.length;d++){
            UnitWish[i].children[d]=unitWishPre[i].children[d];
          }
        }else{
          if(unitWishPre[i].children[j].cid!=UnitWish[i].children[j].cid){
            var temp =  UnitWish[i].children.splice(j,UnitWish[i].children.length-j);
            UnitWish[i].children[j]=unitWishPre[i].children[j];
            for(var k= 0;k<temp.length;k++){
              UnitWish[i].children[j+1]=temp[k];
              j++;
            }
          }
        }

      }
    }

  }

  console.log('unitWishPre--',JSON.stringify(unitWishPre));
  console.log('UnitWish--',JSON.stringify(UnitWish));
    that.step();
},function(data){
  var that = this;
  var sql;
  for(var i=0;i<ItemPreDiv.length;i++){
      sql="update csp_stock set allocatedsa='"+ItemPreDiv[i].allocatedsa+"' where cid='"+ItemPreDiv[i].cid+"'and trid='"+trid+"'"
      csp.db.query(sql,function(err,data){
          that.step();
      });
  }


},function(data){
  var ret = {
    successOr:true,
    UnitWish:UnitWish
  }
  return $util.jsonWrite(res,ret);
})
}
//清零

sql.deleResults = function(req, res){
  var trid = req.query.trid;
  var querySql = "delete from csp_random_allocated_results where gid in(select gid from csp_group where trid ='"+trid+"')"
  csp.db.query(querySql, function(err, data){
    if(err){
        console.log("删除出错",err)
          return $util.jsonWrite(res,{deleteR:false});
    }
    else{
        console.log("对应单元分券结果清零")
        return $util.jsonWrite(res,{deleteR:true});
    }

  })
}

//分券后写入数据
sql.writeResults = function(req, res){
  var trid = req.query.trid;
  var valueStr = req.query.valueStr;
  var insSQL = 'INSERT INTO csp_random_allocated_results(gid,cindex,cid,cname,amount,post_allocated_amount,post_allocated_value,trid) VALUES'
           + valueStr;
           console.log(insSQL)
   csp.db.query(insSQL, function(err, data){
     if(err){
      console.log(err)
      return $util.jsonWrite(res,{writeS:false});
     }
     else{

      return $util.jsonWrite(res,{writeS:true});
     }

   })
}

//分券之后修改总券剩余数量
sql.writeSec = function(req, res){
  //先不管和则个
}
//恢复总券分配数量为0
sql.recoverStock = function(req, res){
  var trid = req.query.trid;
  var querySql = "update csp_stock set allocatedsa = '0' where trid = '"+trid+"'"
  csp.db.query(querySql, function(err, data){
    if(err){

     return $util.jsonWrite(res,{recoverStock:false});
    }
    else{

     return $util.jsonWrite(res,{recoverStock:true});
    }

  })
}

sql.noWishList = function(req, res){
  var trid = req.query.trid;
    var noWish=0;
    var sqlInfo="select distinct gid from csp_group where trid='"+trid+"'order by gid"
    csp.db.query(sqlInfo,function(err,data){
        console.log("该单元所有小组")
        var sql="select distinct gid as gid from csp_wishlist where trid='"+trid+"'order by gid"
        csp.db.query(sql,function(err,data0){
            console.log("选择了心愿清单的小组")
            if(data0.length==0){
                noWish=-1;
            }else{
                if(data.length===data0.length){
                    noWish=0;
                }
                else{
                    noWish=1;
                }
            }
             return $util.jsonWrite(res,{noWish:noWish});

        })
    })
}

//分券成功后清除上一次的心愿清单
sql.deleWishList = function(req, res){
  var trid = req.query.trid;
    var sql="delete from csp_wishlist  where trid='"+trid+"'"
    csp.db.query(sql,function(err,data){
      if(err){

       return $util.jsonWrite(res,{delWish:false});
      }
      else{

       return $util.jsonWrite(res,{delWish:true});
      }

    })
}
//显示分券后小组的结果
sql.getRandmR = function(req, res) {
   var gid = req.query.gid;
        var sql = "select *from csp_random_allocated_results where gid='"+gid+"'order by CAST(cindex as SIGNED) asc";
        csp.db.query(sql,function(err,data){
            return $util.jsonWrite(res,err||data);

        });

}

//获取心愿小组的gid。如果一个都没有，表示一个都没有心愿清单

sql.getWishTid=function(req,res){
  var trid = req.query.trid;
  var querySql = "select distinct gid as gid from csp_wishlist where trid='"+trid+"'order by gid"
  console.log(querySql)
  csp.db.query(querySql, function(err, data){
    return $util.jsonWrite(res,err||data);
  })
}

//分券完成后检查总券中是否还有券没分完
sql.randomOver = function(req,res){
  var trid = req.query.trid;
    var randomOverFlag=0;//0则全分券完，1则没分完
    var sql="SELECT totalsa, allocatedsa FROM csp_stock where trid='"+trid+"'";
    csp.db.query(sql,function(err,data){
      if(err){
        return $util.jsonWrite(res,err);
      }
      else{
        for(var i=0;i<data.length;i++){
            if(data[i].totalsa-data[i].allocatedsa){
                randomOverFlag=1;
                break;
            }
        }
          return $util.jsonWrite(res,{randomOverFlag:randomOverFlag});
      }

    })
}

//已知gid，获取对应的小组名称

sql.getTname=function(req,res){
  var gid = req.query.gid;
  var querySql = "select gname from csp_group where gid = '"+gid+"'"

  csp.db.query(querySql, function(err, data){
    var title = '';
    if(!err){
          title = data[0].gname;
          title = title+"("+gid+")"
      }else{
         console.log(err)
      }
    return $util.jsonWrite(res,err||{title:title});
  })
}

//通过小组gid获取小组的杠杆bp，以及其当前的分券值；
sql.getInfobyGid=function(req,res){

  var gid = req.query.gid;

  var ret={
      "t_bp":'',
      "t_allocated_bp":0,
  }
  Step.Step(function(data){
      var that=this;
      var sql_tbp="SELECT SUM(t.bp*t.bp_heaver) AS bp,i.* FROM `csp_tradergroup` AS m LEFT JOIN `csp_tstrader` AS t ON m.traderid = t.traderid  LEFT JOIN `csp_group` AS i ON m.gid = i.gid  where i.gid = '"+gid+"'"
      csp.db.query(sql_tbp,function(err,data){
          if(err){
              ret.t_bp=null;
              that.step();
          }
          else{
              if(typeof(data[0])=='undefined'){
                  ret.t_bp=null;
              }
              else{
                  ret.t_bp=data[0].bp;
              }
              that.step();
          }

      })
  },function(data){
      var that=this;
      var sql_t_allocated_bp="SELECT SUM(post_allocated_value ) as allvalue FROM csp_random_allocated_results WHERE  gid="+"'"+gid+"'"
      csp.db.query(sql_t_allocated_bp,function(err,data){
          if(err){
              ret.t_allocated_bp=0;
              that.step();
          }
          else{
              console.log("typeof(data[0])",typeof(data[0]))
              console.log("data[0].allvalue",typeof(data[0].allvalue))
              if(typeof(data[0])=='undefined'){
                  ret.t_allocated_bp=0;
              }else if(typeof(data[0].allvalue)!=='number'){
                  ret.t_allocated_bp=0;
              }else {
                  ret.t_allocated_bp=parseFloat(data[0].allvalue).toFixed(2)
              }
              console.log("ret.t_allocated_bp",ret.t_allocated_bp)
              that.step();
          }

      })
  },function(data){
    return $util.jsonWrite(res,ret);

  })
}



sql.saveTidExcelFile = function(req, res){
  var gid = req.params['id'];
  console.log("yuyuyu",gid);
  var selSQL = "select *from csp_random_allocated_results where gid="+gid+" order by cindex*1";
   var filename = "The_"+gid+"_group_randomOut"

   csp.db.query(selSQL, function(err, data){
     if(!err){
 //写入表格
          var tidRandomData = data;
             var cols = []
             var rows = []
             var titles = [
                 "序号","证券代码","证券名称","心愿数量","实际分券数量"
             ]
               //规定列数和类别
                 for(var i=0; i<titles.length; i++){
                     var item = {}
                     item.caption = titles[i];
                     item.type = 'string'
                     cols.push(item)
                 }
                 for(var i=0; i<tidRandomData.length; i++){
                     var item = []
                     item.push((tidRandomData[i].cindex).toString())
                     item.push(tidRandomData[i].cid)
                     item.push(tidRandomData[i].cname)
                     item.push(tidRandomData[i].amount)
                     item.push((tidRandomData[i].post_allocated_amount).toString())
                     rows.push(item)
                 }

                var conf = { };
                conf.cols = cols
                conf.rows = rows

                var result = nodeExcel.execute(conf);

                if(typeof filename === 'undefined'){
                    filename = new Date();
                }
                // console.log("uyuyuyu",filename)
                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader("Content-Disposition", "attachment; filename=" + filename +  ".xlsx");
                res.end(result, 'binary');
         }
   })
}
module.exports = sql;
