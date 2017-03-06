/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */
 //引入事务处理模块
 var dbHelper = require("../dao/dbroutinedao");
 var sql = {};

 //查询小组信息，及券表，券池
 sql.getGroupInfoAndStock = function(req,res) {
     var gid = req.query.gid;
     var trid = req.query.trid;
     var querySql = 'select t1.gid,t1.cid,t1.cname,t1.available_vol,t1.available_amt,t1.post_allocated_vol,t1.post_allocated_amt,t1.stat,t1.trid,t2.gname , IFNULL(t3.newscount,0) as newscount , t4.code, t4.last from csp_groupstock t1 left join csp_group t2 on t2.gid = t1.gid left join (select COUNT(t1.asked_cid) as newscount ,t1.asked_cid FROM csp_asked_change_list t1 INNER JOIN csp_exchange_list t2 on t2.gid = '+gid+' and t2.cid = t1.asked_cid GROUP BY t1.asked_cid) t3 on t3.asked_cid = t1.cid left join csp_tscode t4 on t4.cid = t1.cid where t1.gid =' +gid + ' order by stat desc';
     var querySql1 = 'select t1.gid,t1.cid,t1.cname,t1.post_exchange_vol,t1.post_exchange_amt,t1.stat,t1.trid,t2.gname , t3.code,t3.last from csp_exchange_list t1 left join csp_group t2 on t2.gid = t1.gid left join csp_tscode t3 on t3.cid = t1.cid where t1.trid = "'+trid+'"';
     var querySql2 = 'select ifnull(sum( t1.bp*t1.bp_heaver),0) as total_heaver_bp from csp_tstrader t1 inner join csp_tradergroup t2 on t2.gid = '+gid+' and t2.traderid = t1.traderid ';
     var querySql3 = 'select ifnull(sum(available_amt),0) as available_total_amt, ifnull(sum(post_allocated_amt),0) as allocate_total_amt from csp_groupstock where gid = ' + gid;
     csp.db.query(querySql,function(err,result) {
         if(err) {
            res.send({"result":"failed","reason":"服务器出错了"});
            res.end();
         }
         else {
             csp.db.query(querySql1,function(err1,result1) {
                 if(err1) {
                    res.send({"result":"failed","reason":"服务器出错了"});
                    res.end();
                 }
                 else {
                     csp.db.query(querySql2,function(err2,result2) {
                         if(err2) {
                             res.send({"result":"failed","reason":"服务器出错了"});
                             res.end();
                         }
                         else {
                             csp.db.query(querySql3,function(err3,result3) {
                                 if(err3) {
                                     res.send({"result":"failed","reason":"服务器出错了"});
                                     res.end();
                                 }
                                 else {
                                     res.send({"result":"succeed","allocate_data":result,"exchange_data":result1,"total_heaver_bp":result2[0].total_heaver_bp,"available_total_amt":result3[0].available_total_amt,"allocate_total_amt":result3[0].allocate_total_amt});
                                     res.end();
                                 }
                             })
                         }
                     })
                 }

             })
         }

     })
 }

 //查询小组券表及券池
 sql.getGroupStock = function(req,res) {
	var gid = req.query.gid;
    var trid = req.query.trid;
    var querySql = 'select t1.gid,t1.cid,t1.cname,t1.available_vol,t1.available_amt,t1.post_allocated_vol,t1.post_allocated_amt,t1.stat,t1.trid,t2.gname , IFNULL(t3.newscount,0) as newscount, t4.code,t4.last from csp_groupstock t1 left join csp_group t2 on t2.gid = t1.gid left join (select COUNT(id) as newscount , asked_cid from csp_asked_change_list where asked_gid = '+gid+' ) t3 on t3.asked_cid = t1.cid  left join csp_tscode t4 on t4.cid = t1.cid where t1.gid =' +gid + ' order by stat desc';
    var querySql1 = 'select t1.gid,t1.cid,t1.cname,t1.post_exchange_vol,t1.post_exchange_amt,t1.stat,t1.trid,t2.gname,t3.code,t3.last from csp_exchange_list t1 left join csp_group t2 on t2.gid = t1.gid left join csp_tscode t3 on t3.cid = t1.cid where t1.trid = "'+trid+'"';
    csp.db.query(querySql,function(err,result) {
        if(err) {
           res.send({"result":"failed","reason":"服务器出错了"});
           res.end();
        }
        else {
            csp.db.query(querySql1,function(err1,result1) {
                if(err1) {
                   res.send({"result":"failed","reason":"服务器出错了"});
                   res.end();
                }
                else {
                    res.send({"result":"succeed","data":result,"data1":result1});
                    res.end();
                }

            })
        }

    })
 }

 sql.writedb = function(req,res) {
     var datas = req.query.data;
     var querySql = 'insert into csp_groupstock (gid,cid,cname,available_vol,available_amt,post_allocated_vol,post_allocated_amt,trid,stat) values';
     for(var i = 0 ; i < datas.length;i++) {
         var data = JSON.parse(datas[i]);
         if(i == 0) {
             querySql += '('+data.gid+',"'+data.cid+'","'+data.cname+'",'+data.post_allocated_vol+','+data.post_allocated_amt+'*'+data.value+','+data.post_allocated_vol+','+data.post_allocated_amt+'*'+data.value+',"'+data.trid+'",'+data.stat+')';
         }
         else {
             querySql += ',('+data.gid+',"'+data.cid+'","'+data.cname+'",'+data.post_allocated_vol+','+data.post_allocated_amt+'*'+data.value+','+data.post_allocated_vol+','+data.post_allocated_amt+'*'+data.value+',"'+data.trid+'",'+data.stat+')';
         }
     }
     csp.db.query(querySql,function(err,result) {
         if(err) {
             res.send({"result":"failed"});
         	res.end();
         }
         else {
             res.send({"result":"succeed"});
         	res.end();
         }

     })
 }

 //添加到公共券池
 sql.addExchange = function(req,res) {
     var info = req.query;
     var routine = [];
     var querySql = 'insert into csp_exchange_list (gid,cid,cname,post_exchange_vol,post_exchange_amt,stat,trid)';
     querySql += 'values ('+info.gid+',"'+info.cid+'","'+info.cname+'",'+info.post_exchange_vol;
     querySql += ','+info.post_exchange_amt+',0,"'+info.trid+'")';
     routine.push(dbHelper._getNewSqlParamEntity(querySql));
     var querySql1 = 'update csp_groupstock set stat = 2 where gid = ' + info.gid + ' and cid = "'+info.cid+'"';
     routine.push(dbHelper._getNewSqlParamEntity(querySql1));
     dbHelper.execTrans(routine,function(err,result) {
         if(err) {
             res.send({"result":"failed","reason":"服务器出错了"});
             res.end();
         }
         else {
             res.send({"result":"succeed"});
         	 res.end();
         }
     })
 }

 //撤销换券
 sql.deleteExchange = function(req,res) {
     var info = req.query;
     var routine = [];
     var querySql = 'delete from csp_exchange_list where gid = ' + info.gid + ' and cid = "'+info.cid+'"';
     routine.push(dbHelper._getNewSqlParamEntity(querySql));
     var querySql1 = 'update csp_groupstock set stat = 0 where gid = '+ info.gid + ' and cid = "' + info.cid + '"';
     routine.push(dbHelper._getNewSqlParamEntity(querySql1));
     var querySql2 = 'delete from csp_asked_change_list where asked_gid = ' + info.gid + ' and asked_cid = "' + info.cid + '"';
     routine.push(dbHelper._getNewSqlParamEntity(querySql2));
     dbHelper.execTrans(routine,function(err,result) {
         if(err) {
             res.send({"result":"failed","reason":"服务器出错了"});
             res.end();
         }
         else {
             res.send({"result":"succeed"});
         	 res.end();
         }
     })
 }

 //添加交换请求
 sql.addAskExchange = function(req,res) {
     var info = req.query;
     var routine = [];
     var querySql = 'insert into csp_asked_change_list (ask_gid,ask_cid,ask_cname,ask_volume,ask_value,asked_gid,asked_cid,asked_cname,asked_volume,asked_value)';
     querySql += 'values ('+info.ask_gid+',"'+info.ask_cid+'","'+info.ask_cname+'",'+info.ask_volume+','+info.ask_value;
     querySql += ','+info.asked_gid+',"'+info.asked_cid+'","'+info.asked_cname+'",'+info.asked_volume+','+info.asked_value+')';
     routine.push(dbHelper._getNewSqlParamEntity(querySql));
     var querySql1 = 'update csp_groupstock set stat = 3 where gid = ' + info.asked_gid + ' and cid = "'+info.asked_cid+'"';
     routine.push(dbHelper._getNewSqlParamEntity(querySql1));
     dbHelper.execTrans(routine,function(err,result) {
         if(err) {
             res.send({"result":"failed","reason":"服务器出错了"});
             res.end();
         }
         else {
             res.send({"result":"succeed"});
         	 res.end();
         }
     })
 }

 //获取请求列表
 sql.getExchangeNews = function(req,res) {
     var gid = req.query.gid;
     var cid = req.query.cid;
     var querySql = 'select t1.id,t1.ask_gid,t1.ask_cid,t1.ask_cname,t1.ask_volume,t1.ask_value,t1.asked_gid,t1.asked_cid,t1.asked_cname,t1.asked_volume,t1.asked_value ';
     querySql += ', ifnull(t2.gname,"-") as gname from csp_asked_change_list t1 left join csp_group t2 on t2.gid = t1.ask_gid where t1.asked_gid = ' + gid + ' and t1.asked_cid = "'+cid+'"';
     csp.db.query(querySql,function(err,result) {
         if(err) {
             res.send({"result":"failed","reason":"服务器出错了"});
             res.end();
         }
         else {
             res.send({"result":"succeed","data":result});
         	 res.end();
         }
     })
 }

 module.exports = sql;
