/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */
 var sql = {};

sql.getAllMaid = function(req,res) {
    var querySql = 'select maid,maname from csp_tamgr';
    csp.db.query(querySql,function(err,result) {
        if(err) {
            res.send({"result":"failed"});
            res.end();
        }
        else {
            res.send({"result":"succeed","data":result});
            res.end();
        }
    })
}

sql.getOidByMaid = function(req,res) {
    var page = req.query.page;
    var pageCount = req.query.pageCount;
    var start = (page - 1) * pageCount;
    var querySql = 'select t1.maid,t1.oid,t1.oname,t1.stat,t2.maname from csp_tsoper t1 left join csp_tamgr t2 on t1.maid = t2.maid where t1.maid = "'+req.query.maid+'" limit ' + start + ',' + pageCount;
    var querySql2 = 'select COUNT(id) as totalcount from csp_tsoper where maid = "'+req.query.maid+'"';
    csp.db.query(querySql2,function(err2,result2) {
        if(err2) {
            res.send({"result":"failed"});
            res.end();
        }
        else {
            csp.db.query(querySql,function(err,result) {
                if(err) {
                    res.send({"result":"failed"});
                    res.end();
                }
                else {
                    res.send({"result":"succeed","data":result,"count":result2[0].totalcount});
                    res.end();
                }
            })
        }
    })
}

sql.getOperByOid = function(req,res) {
    var querySql = 'select t1.id,t1.maid,t1.oid,t1.oname,t1.phone,t1.email,t1.idcard,t1.stat,t2.maname from csp_tsoper t1 left join csp_tamgr t2 on t2.maid = t1.maid where t1.oid = "'+req.query.oid+'"';
    csp.db.query(querySql,function(err,result) {
        if(err) {
            res.send({"result":"failed"});
            res.end();
        }
        else {
            if(result.length > 0 && typeof(result[0]) != "undefined") {
                res.send({"result":"succeed","exist":true,"oper":result[0]});
                res.end();
            }
            else {
                res.send({"result":"succeed","exist":false});
                res.end();
            }
        }
    })
}

sql.addOper = function(req,res) {
    var oid = req.query.maid + "." + req.query.oid;
    var querySql1 = 'select id from csp_tsoper where oid = "'+oid+'"';
    csp.db.query(querySql1,function(err1,result1) {
        if(err1) {
            res.send({"result":"failed","reason":"数据库异常"});
            res.end();
        }
        else {
            if(result1.length > 0 && typeof(result1[0]) != "undefined") {
                res.send({"result":"failed","reason":"操作员账号已存在"});
                res.end();
            }
            else {
                var querySql2 = 'insert into csp_tsoper(maid,oid,oname,opass,lastlogin,phone,email,idcard,stat) values("'+req.query.maid+'","'+oid+'","'+req.query.oname+'","'+req.query.opass+'",now(),"'+req.query.phone+'","'+req.query.email+'","'+req.query.idcard+'","'+req.query.stat+'")';
                csp.db.query(querySql2,function(err2,result2) {
                    if(err2) {
                        res.send({"result":"failed","reason":"数据库异常"});
                        res.end();
                    }
                    else {
                        res.send({"result":"succeed"});
                        res.end();
                    }
                })
            }
        }
    })
}

sql.updateOper = function(req,res) {
    var querySql = 'update csp_tsoper set oname = "'+req.query.oname+'",phone = "'+req.query.phone+'",email = "'+req.query.email+'",idcard = "'+req.query.idcard+'" where oid = "'+req.query.oid+'"';
    csp.db.query(querySql,function(err,result) {
        if(err) {
            res.send({"result":"failed","reason":"数据库异常"});
            res.end();
        }
        else {
            res.send({"result":"succeed"});
            res.end();
        }
    })
}

sql.changeOperStat = function(req,res) {
    var querySql = 'update csp_tsoper set stat = "'+req.query.stat+'" where oid = "'+req.query.oid+'"';
    csp.db.query(querySql,function(err,result) {
        if(err) {
            res.send({"result":"failed","reason":"数据库异常"});
            res.end();
        }
        else {
            res.send({"result":"succeed"});
            res.end();
        }
    })
}

sql.resetPass = function(req,res) {
    var querySql = 'update csp_tsoper set opass = "'+req.query.opass+'" where oid = "'+req.query.oid+'"';
    csp.db.query(querySql,function(err,result) {
        if(err) {
            res.send({"result":"failed","reason":"数据库异常"});
            res.end();
        }
        else {
            res.send({"result":"succeed"});
            res.end();
        }
    })
}
//获取资产单元
sql.getCaidByMaid = function(req,res) {
    var querySql = 'select caid ,caname from csp_tacap  where maid = "'+req.query.maid+'"';
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

//获取交易单元
sql.getTridByCaid = function(req,res) {
    var querySql = 'select trid ,trname from csp_tatrd  where caid = "'+req.query.caid+'"';
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

//交易员授权
sql.addTrader = function(req,res) {
    var querySql = 'select oid from csp_tstrader where traderid = "'+req.query.traderid+'"';
    csp.db.query(querySql,function(err,result) {
        if(err) {
            res.send({"result":"failed","reason":"服务器出错了"});
            res.end();
        }
        else {
            if(result.length > 0) {
                // res.send({"result":"failed","reason":"已授权过该交易单元"});
                // res.end();
                querySql1 = 'update csp_tstrader set bp_heaver = ' + req.query.bp_heaver + ' , bp =' + req.query.bp + ' where traderid = "'+req.query.traderid+'"';
                csp.db.query(querySql1,function(err1,result1) {
                    if(err1) {
                        res.send({"result":"failed","reason":"服务器出错了"});
                        res.end();
                    }
                    else {
                        res.send({"result":"succeed"});
                        res.end();
                    }
                })
            }
            else {
                var querySql1 = 'insert into csp_tstrader (traderid,trid,oid,bp,bp_heaver,stat) values ("'+req.query.traderid+'","'+req.query.trid+'","'+req.query.oid+'",'+req.query.bp+','+req.query.bp_heaver+','+req.query.stat+')';
                csp.db.query(querySql1,function(err1,result1) {
                    if(err1) {
                        res.send({"result":"failed","reason":"服务器出错了"});
                        res.end();
                    }
                    else {
                        res.send({"result":"succeed"});
                        res.end();
                    }
                })
            }
        }
    })
}

 module.exports = sql;
