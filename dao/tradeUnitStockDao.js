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
// var m_async = require('async');
var dbHelper=require('../dao/dbroutinedao');
var sql = {};


sql.getStocksByTrade=function(req,res){
  var querySql = 'select cid,cname,totalsa,allocatedsa,trid,stat,DATE_FORMAT(importdate,"%Y-%m-%d") as importdate from csp_stock where trid="'+req.query.trid+'" order by importdate desc';

  if(typeof( req.query.pageRows)!='undefined'&&typeof( req.query.page)!='undefined'){
    querySql+=' limit '+(req.query.page-1)*req.query.pageRows+','+req.query.pageRows+'';
  }

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,result);
    });
}

// sql.importStock = function( req,res) {
//   console.log('importStock',req.query.stocks);
//   m_async.series([
//     function(callback1) {
//       var querySql1 = 'delete from csp_stock where trid ="'+req.query.trid+'" ';
//       console.log(querySql1);
//
//       csp.db.query(querySql1,function(err1,info1) {
//         callback1(err1,info1);
//       })
//     },
//     function(callback2) {
//       var querySql2 ='insert into csp_stock values ';
//       var insertStocks='';
//
//       if (req.query.stocksCount==1) {
//         var stocks=JSON.parse(req.query.stocks);
//         insertStocks+=' ("'+stocks.cid+'","'+stocks.cname+'",'+stocks.totalsa+','+stocks.allocatedsa+',"'+stocks.trid+'","'+stocks.stat+'","'+stocks.importdate+'"),';
//       }
//       else {
//         console.log('stocks');
//         for (var i = 0; i < req.query.stocks.length; i++) {
//           var stocks=JSON.parse(req.query.stocks[i]);
//           insertStocks+=' ("'+stocks.cid+'","'+stocks.cname+'",'+stocks.totalsa+','+stocks.allocatedsa+',"'+stocks.trid+'","'+stocks.stat+'","'+stocks.importdate+'"),';
//         }
//         if (insertStocks.length>0) {
//           insertStocks=insertStocks.substring(0,insertStocks.length-1);
//         }
//       }
//
//
//       querySql2+=insertStocks;
//
//       console.log(querySql2);
//       csp.db.query(querySql2,function(err2,info2) {
//         callback2(err2,info2);
//       })
//     }
//   ],function(err,result) {
//     if(err) {
//       csp.db.rollback();
//       res.send({"result":false,'reason':'写数据库失败!'});
//       res.end();
//     }
//     else {
//       csp.db.commit();
//       res.send({"result":true});
//       res.end();
//     }
//   });
// }


//
// sql.importStock = function( req,res) {
//   console.log('importStock',req.query.stocks);
//
//   var tasks=[
//     function(callback){
//       // 开启事务
//         csp.db.beginTransaction(function(err) {
//           callback(err);
//       });
//     },
//     function(callback1) {
//       var querySql1 = 'delete from csp_stock where trid ="'+req.query.trid+'" ';
//       console.log(querySql1);
//
//       csp.db.query(querySql1,function(err1,info1) {
//         callback1(err1,info1);
//       })
//     },
//     function(callback2) {
//       var querySql2 ='insert into csp_stock values ';
//       var insertStocks='';
//
//       if (req.query.stocksCount==1) {
//         var stocks=JSON.parse(req.query.stocks);
//         insertStocks+=' ("'+stocks.cid+'","'+stocks.cname+'",'+stocks.totalsa+','+stocks.allocatedsa+',"'+stocks.trid+'","'+stocks.stat+'","'+stocks.importdate+'"),';
//       }
//       else {
//         console.log('stocks');
//         for (var i = 0; i < req.query.stocks.length; i++) {
//           var stocks=JSON.parse(req.query.stocks[i]);
//           insertStocks+=' ("'+stocks.cid+'","'+stocks.cname+'",'+stocks.totalsa+','+stocks.allocatedsa+',"'+stocks.trid+'","'+stocks.stat+'","'+stocks.importdate+'"),';
//         }
//         if (insertStocks.length>0) {
//           insertStocks=insertStocks.substring(0,insertStocks.length-1);
//         }
//       }
//       querySql2+=insertStocks;
//
//       console.log(querySql2);
//       csp.db.query(querySql2,function(err2,info2) {
//         callback2(err2,info2);
//       })
//     },function(callback){
//       csp.db.commit(function(err){
//         callback(err);
//       });
//     }
//   ];
//
//   m_async.series(tasks,function(err,result) {
//     if(err) {
//       csp.db.rollback();
//       res.send({"result":false,'reason':'写数据库失败!'});
//       res.end();
//     }
//     else {
//       // csp.db.commit();
//       res.send({"result":true});
//       res.end();
//     }
//   });
// }



sql.importStock = function( req,res) {
  console.log('importStock',req.query.stocks);

  var querySql1 = 'delete from csp_stock where trid ="'+req.query.trid+'" ';


  var querySql2 ='insert into csp_stock values ';
  var insertStocks='';

  if (req.query.stocksCount==1) {
    var stocks=JSON.parse(req.query.stocks);
    insertStocks+=' ("'+stocks.cid+'","'+stocks.cname+'",'+stocks.totalsa+','+stocks.allocatedsa+',"'+stocks.trid+'","'+stocks.stat+'","'+stocks.importdate+'")';
  }
  else {
    console.log('stocks');
    for (var i = 0; i < req.query.stocks.length; i++) {
      var stocks=JSON.parse(req.query.stocks[i]);
      insertStocks+=' ("'+stocks.cid+'","'+stocks.cname+'",'+stocks.totalsa+','+stocks.allocatedsa+',"'+stocks.trid+'","'+stocks.stat+'","'+stocks.importdate+'"),';
    }
    if (insertStocks.length>0) {
      insertStocks=insertStocks.substring(0,insertStocks.length-1);
    }
  }
  querySql2+=insertStocks;

  var tasks=[querySql1,querySql2];
  console.log('tasks',tasks);
  dbHelper.executeSqlTrans(tasks,function(err,result){
      console.log('executeSqlTrans',err,'result',result);
      if (err) {
        res.send({result:false,reason:'写数据库失败!'});
        res.end();
      }else {
        res.send({result:true});
        res.end();
      }

  });


}


sql.saveEditStock=function(req,res){
  var querySql = 'update csp_stock set cname="'+req.query.cname+'",totalsa='+req.query.totalsa+',allocatedsa='+req.query.allocatedsa+',importdate="'+req.query.importdate+'",stat='+req.query.stat+' where cid="'+req.query.cid+'" and trid="'+req.query.trid+'"';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,{result:true});
    });
}

sql.createStock=function(req,res){
  var querySql = 'insert into csp_stock value("'+req.query.cid+'","'+req.query.cname+'",'+req.query.totalsa+','+req.query.allocatedsa+',"'+req.query.trid+'","'+req.query.stat+'","'+req.query.importdate+'")';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,{result:true});
    });
}

sql.delStock=function(req,res){
  var querySql = 'delete from csp_stock where trid="'+req.query.trid+'" and cid="'+req.query.cid+'"';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,{result:true});
    });
}

sql.getStockAmountByTrade=function(req,res){
  var querySql ='select count(trid) as stockAmount from csp_stock where trid="'+req.query.trid+'"';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,result[0]);
    });
}
module.exports = sql;
