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

sql.login = function(req,res) {
	var info = req.query;
	var oid = info.login_maid + "." + info.login_oid;
	var querySql1 = 'select id,stat from csp_tsoper where maid = "'+info.login_maid+'" and oid = "'+ oid + '" and opass = "'+info.login_pass+'"';
	csp.db.query(querySql1,function(err1,result1) {
		if(err1) {
			res.send({"result":"failed","reason":"服务器出错了"})
			res.end();
		}
		else {
			if(result1.length == 0) {
				res.send({"result":"failed","reason":"登录信息错误"})
				res.end();
			}
			else {
				if(result1[0].stat == "1") {
					res.send({"result":"failed","reason":"操作员已冻结"})
					res.end();
				}
				else {
					var querySql2 = 'update csp_tsoper set lastlogin = now() where id = ' + result1[0].id;
					csp.db.query(querySql2,function(err2,result2) {
						if(err2) {
							res.send({"result":"failed","reason":"服务器出错了"})
							res.end();
						}
						else {
							req.session.login_maid = info.login_maid;
							req.session.login_oid = oid;
							res.send({"result":"succeed"})
							res.end();
						}
					})
				}
			}
		}
	})
}

sql.checkAndLogin = function(req,res) {
    var info = req.query;
	var oid = info.login_maid + "." + info.login_oid;
	var querySql1 = 'select id,stat from csp_tsoper where maid = "'+info.login_maid+'" and oid = "'+ oid + '" and opass = "'+info.login_pass+'"';
	csp.db.query(querySql1,function(err1,result1) {
		if(err1) {
			res.send({"result":"failed","reason":"服务器出错了"})
			res.end();
		}
		else {
			if(result1.length == 0) {
				res.send({"result":"failed","reason":"登录信息错误"})
				res.end();
			}
			else {
				if(result1[0].stat == "1") {
					res.send({"result":"failed","reason":"操作员已冻结"})
					res.end();
				}
				else {
					var querySql2 = 'update csp_tsoper set lastlogin = now() where id = ' + result1[0].id;
					csp.db.query(querySql2,function(err2,result2) {
						if(err2) {
							res.send({"result":"failed","reason":"服务器出错了"})
							res.end();
						}
						else {
							req.session.login_maid = info.login_maid;
							req.session.login_oid = oid;
							res.send({"result":"succeed"})
							res.end();
						}
					})
				}
			}
		}
	})
}

sql.checkGroupAndGetList = function(req,res) {
    var oid;
    if(req.query.useparams == 0) {
        oid = req.session.login_oid;
    }
    else {
        oid = req.query.oid;
    }
    var querySql = '';
    querySql += 'select t1.gid ,t2.gname,t3.traderid,t3.trname,t3.caname ,t3.trid,t3.caid ';
    querySql += ' from csp_tradergroup t1 left join csp_group t2 on t2.gid = t1.gid ';
    querySql += ' inner join ( select a.traderid , a.oid, b.trname,b.trid ,c.caid,c.caname from  csp_tstrader a ';
    querySql += ' left join csp_tatrd b on b.trid = a.trid ';
    querySql += ' left join csp_tacap c on c.caid = b.caid where a.oid = "'+oid+'" ) t3 ';
    querySql += ' on t3.oid = "'+oid+'" and t3.traderid = t1.traderid where t1.leader = 1';
    csp.db.query(querySql,function(err,result) {
        if(err) {
            res.send({"result":"failed","reason":"服务器出错了"})
            res.end();
        }
        else {
            if(result && result.length > 0) {
                res.send({"result":"succeed","data":result})
                res.end();
            }
            else {
                res.send({"result":"failed","reason":"试图访问一个未经授权的界面"})
                res.end();
            }
        }
    })
}

 module.exports =  sql;
