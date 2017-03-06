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



sql.getTidModel=function(req,res){
  var trid = req.query.trid;
  var querySql = "select gid,gname from csp_group where trid = '"+trid+"' order by gid"
  console.log(querySql)

  csp.db.query(querySql,function(err,data){

    if(err){

      console.log("errrrrr",err);
      return $util.jsonWrite(res,err);

    }else{
      var length = data.length
       var model = []
       var tidPre = ''
       var indexTid = -1
       for (var i = 0; i < length; i++) {
           if (tidPre !== data[i].gid) {
               indexTid++
               tidPre = data[i].gid
               var itemTid = {
                   tid: '',
                   tname: '',
                   title:''
               }
               itemTid.tid = data[i].gid
               itemTid.tname = data[i].gname
               itemTid.title = data[i].gname + "(" + itemTid.tid + ")"
               model[indexTid] = itemTid

           }
       }
      return $util.jsonWrite(res,model);
      }
    });
}


sql.getUnitStocks=function(req,res){
  var trid = req.query.trid;
  var querySql ='SELECT * FROM ( SELECT a.`cid`, a.`cname`, a.`totalsa`, a.`allocatedsa`, b.`preclose`,b.`trday`'
         +' FROM csp_stock AS a, ( select max(trday) as trday,cid ,preclose from (select * from csp_tsmdclear AS b order by trday desc) b group by  cid) as b '
         +'WHERE b.`cid` = a.`cid`  AND (a.`totalsa`- a.`allocatedsa`)<>0 AND a.`trid` = "'
         + trid +'" ORDER BY a.`cid` ASC) AS aaa  '
         +'UNION SELECT * FROM( SELECT a.`cid`, a.`cname`, a.`totalsa`, a.`allocatedsa`, b.`preclose`,b.`trday`'
         +'FROM csp_stock AS a,  ( select max(trday) as trday,cid ,preclose from (select * from csp_tsmdclear AS b order by trday desc) b group by  cid) as b '
         +' WHERE b.`cid` = a.`cid` AND (a.`totalsa`- a.`allocatedsa`)=0 AND a.`trid` = "'
         + trid +'" ORDER BY a.`cid` ASC) AS bbb'
  console.log(querySql)

  csp.db.query(querySql,function(err,data){

    if(err){

      console.log("errrrrr",err);
      return $util.jsonWrite(res,err);

    }else{

      return $util.jsonWrite(res,data);
      }
    });
}

sql.submitWishList = function(req,res) {
  var valueStr = req.query.valueStr;
  var gid = req.query.gid;
    var delSQL = 'DELETE  FROM csp_wishlist WHERE gid ='+gid;

    csp.db.query(delSQL, function(err, data) {
        if(!err){
          var insSQL = 'INSERT INTO csp_wishlist(cindex,cid,cname,amount,importdate,gid,trid) VALUES'
                   + valueStr;
          csp.db.query(insSQL, function(err, data) {
             if(err){
                return $util.jsonWrite(res,err);
             }
                return $util.jsonWrite(res,data);
          })
        }else{
           return $util.jsonWrite(res,err);
        }
   })
}



sql.getGroupWishList = function(req,res) {
  var gid = req.query.gid;
  var trid = req.query.trid;
    var querySql = "SELECT * FROM ( SELECT a.gid,a.`cid`, a.`cname`, a.`amount`, a.`cindex`, b.`preclose`,b.`trday` FROM csp_wishlist AS a, ( select max(trday) as trday,cid ,preclose from (select * from csp_tsmdclear AS b order by trday desc) b group by  cid) as b WHERE b.`cid` = a.`cid`   AND a.`trid` = '"+trid+"'and a.gid = '"+gid+"' ORDER BY a.`cid` ASC) AS aaa "

    csp.db.query(querySql, function(err, data) {

      var ret ={
          "error" : false,
          "groupWishListdata"  : [],
      }

        if(!err){
             ret.groupWishListdata = data;
           return $util.jsonWrite(res,ret);
        }else{
          ret.error = true;
          console.log("getGroupWishList err---->",err)
           return $util.jsonWrite(res,ret);
        }
   })
}


sql.getGroupBpValue=function(req,res){
  var gid = req.query.gid;

  var querySql = "select SUM(ts.bp) AS bp, SUM(ts.bp*ts.bp_heaver) AS heaverBP from csp_tstrader as ts where ts.traderid in (select traderid from csp_tradergroup where gid = '"+gid+"')"
  console.log(querySql)

  csp.db.query(querySql,function(err,data){
     var ret = {
       bpData:'',
       heaverBP:'',
       surplusHeaverBP:''
     }
    if(err){

      console.log("errrrrr",err);
      return $util.jsonWrite(res,err);

    }else{

      if(data[0].bp===null){
        ret.bpData = 0;
        ret.heaverBP = 0;
        ret.surplusHeaverBP = 0;
        return $util.jsonWrite(res,ret);
      }else{
        ret.bpData = data[0].bp
        ret.heaverBP = data[0].heaverBP
        var querySql1 = "SELECT SUM(crar.post_allocated_amount*tc.preclose) AS allocatedValue  FROM csp_random_allocated_results AS crar LEFT JOIN (select cid, max(trday), preclose from (select * from csp_tsmdclear order by trday desc ) a group by cid ) as tc on crar.cid = tc.cid where gid='"+gid+"'"
        csp.db.query(querySql1, function(err,data){
          if(err){
              return $util.jsonWrite(res,err);
          }else{

              ret.surplusHeaverBP = ret.heaverBP - data[0].allocatedValue
              console.log(ret);
              return $util.jsonWrite(res,ret);
          }

        })
      }


    }




    });
}
module.exports = sql;
