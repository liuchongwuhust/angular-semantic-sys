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

sql.getShowProduct = function(req,res) {
	var querySql1 = 'select t1.priority ,t1.proid,t1.protype,t2.caption,t2.piclink,t2.prostatus from product_layout t1 left join product t2 on t2.id = t1.proid where t1.protype = 1 order by t1.priority ';
	var querySql2 = 'select t1.priority ,t1.proid,t1.protype,t2.caption,t2.piclink,t2.prostatus from product_layout t1 left join product_2 t2 on t2.id = t1.proid where t1.protype = 2 order by t1.priority ';
	csp.db.query(querySql1,function(err1,result1) {
		if(err1) {
            console.log("err1");
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			csp.db.query(querySql2,function(err2,result2) {
				if(err2) {
                    console.log("err2");
					res.send({"result":"failed","reason":"服务器出错了"});
					res.end();
				}
				else {
					res.send({"result":"succeed","data":result1,"data_2":result2});
					res.end();
				}
			})
		}
	})
}

sql.getAllProducts = function(req,res) {
    var querySql;
    if(req.query.protype == 1) {
        querySql = 'select id as proid,caption,piclink,prostatus from product';
    }
    else {
        querySql = 'select id as proid,caption,piclink,prostatus from product_2';
    }
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

sql.updateLayout = function(req,res) {
    var querySql = 'insert into product_layout (proid,protype,priority) values ('+req.query.proid+','+req.query.protype+','+req.query.priority+') ON DUPLICATE KEY UPDATE proid = ' + req.query.proid;
    csp.db.query(querySql,function(err,result) {
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

 module.exports = sql;
